import { entriesReceived, failed, type Entry } from '../invoices/state/slice'
import type { AppDispatch } from '../state/store'

const worker = '/workers/main.js'
const decoder = new TextDecoder()

type WorkerMessage = {
  type: string
  entries?: Entry[]
  message?: string
}

export function connect(dispatch: AppDispatch) {
  const bridge = window.bridge
  if (!bridge) {
    dispatch(failed('Pear bridge unavailable'))
    return
  }

  bridge.onWorkerIPC(worker, (data) => {
    const message = decoder.decode(data)
    if (!message.startsWith('{')) return

    const parsed = JSON.parse(message) as WorkerMessage
    if (parsed.type === 'autopass:entries') dispatch(entriesReceived(parsed.entries || []))
    else if (parsed.type === 'autopass:error') dispatch(failed(parsed.message || ''))
  })

  bridge.onWorkerExit(worker, (code) => dispatch(failed(`worker exited (${code})`)))

  bridge
    .startWorker(worker)
    .then(() => bridge.writeWorkerIPC(worker, JSON.stringify({ type: 'autopass:list' })))
    .catch((error) => dispatch(failed(String(error))))
}

async function write(message: unknown) {
  if (!window.bridge) throw new Error('Pear bridge unavailable')
  return window.bridge.writeWorkerIPC(worker, JSON.stringify(message))
}

export function requestListEntries() {
  return write({ type: 'autopass:list' })
}

export function requestAddEntry(key: string, value: string) {
  return write({ type: 'autopass:add', key, value })
}

export function requestRemoveEntry(key: string) {
  return write({ type: 'autopass:remove', key })
}
