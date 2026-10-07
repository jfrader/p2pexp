const PearRuntime = require('pear-runtime') // pear-runtime on desktop; pear-mobile on mobile
const Hyperswarm = require('hyperswarm')
const Corestore = require('corestore')
const goodbye = require('graceful-goodbye')
const FramedStream = require('framed-stream')
const path = require('bare-path')
const dir = require('bare-storage')
const { isBareKit } = require('which-runtime')
const Autopass = require('autopass')

// mobile doesn't have the executable path (argv[0])
// and the worker entry path (argv[1]) in the workers argv‘s
// ... to reuse the same worker in all platforms this logic is needed
const argv = (index) => Bare.argv[index + (isBareKit ? 0 : 2)]

const updaterConfig = {
  updates: argv(0) !== 'false',
  version: argv(1),
  upgrade: argv(2),
  name: argv(3),
  dir: argv(4) || dir.persistent(), // argv[4] is undefined in mobile
  app: argv(5), // argv[5] is undefined in mobile
}

const pipe = new FramedStream(Bare.IPC)
const store = new Corestore(path.join(updaterConfig.dir, 'pear-runtime', 'corestore'))
const swarm = new Hyperswarm()
const pear = new PearRuntime({ ...updaterConfig, swarm, store })
const autopassStore = new Corestore(path.join(updaterConfig.dir, 'autopass'))

const pass = new Autopass(autopassStore)

async function listEntries(passInstance) {
  await passInstance.ready()
  return await new Promise((resolve, reject) => {
    const stream = passInstance.list()
    const records = []
    stream.on('data', (record) =>
      records.push({ key: record.key, value: record.value ? record.value : '' }),
    )
    stream.once('end', () => resolve(records))
    stream.once('error', reject)
  })
}

async function pushEntries() {
  try {
    const entries = await listEntries(pass)
    pipe.write(JSON.stringify({ type: 'autopass:entries', entries }))
  } catch (err) {
    pushError(err)
  }
}

function pushError(err) {
  pipe.write(JSON.stringify({ type: 'autopass:error', message: err.message }))
}

pass
  .ready()
  .then(() => {
    pass.on('update', pushEntries)
    return pushEntries()
  })
  .catch(pushError)

pear.updater.on('error', (err) => pipe.write('updater-error ' + err.message))

if (updaterConfig.updates !== false) {
  swarm.on('connection', (connection) => store.replicate(connection))
  swarm.join(pear.updater.drive.core.discoveryKey, {
    client: true,
    server: false,
  })
}

// An append on the app's drive doesn't check for an update straight away: the
// updater defers it by a random delay of up to an hour (see PearRuntimeUpdater)
// so that a released fleet doesn't hit the seeder all at once. Forward the
// delay so the app can say it is waiting rather than look inert. Without it,
// a staged update is indistinguishable from a broken updater for up to an hour.
pear.updater.on('update-scheduled', (delay) => pipe.write('update-scheduled ' + delay))
pear.updater.on('updating', () => pipe.write('updating'))
pear.updater.on('updated', () => pipe.write('updated'))
pear.on('minver-required', () => pipe.write('minver-required')) // for mobile store update notification

goodbye(async () => {
  await pass.close()
  await autopassStore.close()
  await swarm.destroy()
  await pear.close()
  await store.close()
})

pipe.on('data', async (data) => {
  const message = data.toString()
  if (message.startsWith('{')) {
    try {
      const request = JSON.parse(message)
      await pass.ready()
      if (request.type === 'autopass:list') {
        await pushEntries()
      } else if (request.type === 'autopass:add') {
        await pass.add(request.key, request.value)
        await pushEntries()
      } else if (request.type === 'autopass:remove') {
        await pass.remove(request.key)
        await pushEntries()
      }
    } catch (err) {
      pushError(err)
    }
    return
  }
  if (message !== 'pear:applyUpdate') {
    return
  }

  try {
    await pear.ready()
    await pear.updater.applyUpdate()
    pipe.write('pear:updateApplied')
  } catch (err) {
    pipe.write('pear:updateFailed ' + err.message)
  }
})
