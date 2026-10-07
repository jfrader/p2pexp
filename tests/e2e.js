const { spawn } = require('child_process')
const net = require('net')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { chromium } = require('playwright')

const EXE = path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron')
const ARTIFACTS = path.join(os.tmpdir(), 'p2pexp-e2e')
const STORAGE = path.join(ARTIFACTS, 'storage')

const results = []

async function step(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`PASS ${name}`)
  } catch (error) {
    results.push({ name, ok: false, error: String(error).split('\n')[0] })
    console.log(`FAIL ${name}: ${String(error).split('\n')[0]}`)
  }
}

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })
}

async function connect(page) {
  await page.waitForSelector('text=Payment requests', { timeout: 20000 })
  await page.waitForFunction(
    () => {
      const button = [...document.querySelectorAll('button')].find((b) =>
        b.textContent.includes('Share invoice'),
      )
      return button !== undefined && !button.disabled
    },
    { timeout: 20000 },
  )
}

async function main() {
  fs.rmSync(ARTIFACTS, { recursive: true, force: true })
  fs.mkdirSync(ARTIFACTS, { recursive: true })

  const port = await freePort()
  const child = spawn(
    EXE,
    ['.', '--no-updates', '--no-sandbox', '--cdp-port', String(port), '--storage', STORAGE],
    { env: { ...process.env, PEAR_DEV_SERVER_URL: '' }, stdio: 'ignore' },
  )

  let browser
  try {
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`)
        break
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    if (!browser) throw new Error('CDP never came up')

    const page = browser.contexts()[0].pages()[0]
    await page.waitForLoadState()

    await step('app boots to invoices screen', async () => {
      await page.waitForSelector('text=Payment requests', { timeout: 20000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '1-boot.png') })
    })

    await step('autopass connects (share button enabled)', async () => {
      await connect(page)
      await page.screenshot({ path: path.join(ARTIFACTS, '2-ready.png') })
    })

    await step('invalid on-chain address is rejected', async () => {
      await page.fill('input[name="address"]', 'not-an-address')
      await page.fill('input[name="amountBtc"]', '0.0015')
      await page.click('button:has-text("Share invoice")')
      await page.waitForSelector('text=Not a valid mainnet Bitcoin address', { timeout: 5000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '3-invalid-address.png') })
    })

    await step('valid on-chain invoice is created with QR', async () => {
      await page.fill('input[name="address"]', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
      await page.fill('input[name="amountBtc"]', '0.0015')
      await page.fill('input[name="description"]', 'e2e coffee')
      await page.click('button:has-text("Share invoice")')
      await page.waitForSelector('text=Open', { timeout: 10000 })
      await page.waitForSelector('svg', { timeout: 5000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '4-invoice-card.png') })
    })

    await step('invoice shows amount and description', async () => {
      await page.waitForSelector('text=150,000 sats', { timeout: 5000 })
      await page.waitForSelector('text=e2e coffee', { timeout: 5000 })
      await page.waitForSelector('text=0.0015 BTC', { timeout: 5000 })
    })

    await step('inspect link points to mempool.space', async () => {
      const href = await page.getAttribute('[aria-label="Inspect on mempool.space"]', 'href')
      if (href !== 'https://mempool.space/address/bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4') {
        throw new Error(`unexpected href: ${href}`)
      }
    })

    await step('copy destination shows feedback', async () => {
      const copy = page.locator('[aria-label="Copy destination"]')
      await copy.hover()
      await page.waitForSelector('text=Copy', { timeout: 5000 })
      await copy.click()
      await page.waitForSelector('text=Copied!', { timeout: 10000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '5-copied.png') })
    })

    await step('mark as paid flips the chip', async () => {
      await page.click('button:has-text("Mark as paid")')
      await page.waitForSelector('text=Paid', { timeout: 10000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '6-paid.png') })
    })

    await step('remove deletes the invoice', async () => {
      await page.click('button:has-text("Remove")')
      await page.waitForSelector('text=No invoices yet', { timeout: 10000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '7-empty.png') })
    })
  } finally {
    if (browser) await browser.close().catch(() => {})
    child.kill('SIGTERM')
  }

  console.log('\n=== SUMMARY ===')
  for (const result of results) console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name}`)
  console.log(`\nArtifacts: ${ARTIFACTS}`)
  if (results.some((result) => !result.ok)) process.exit(1)
}

main().catch((error) => {
  console.error('RUNNER ERROR', error)
  process.exit(1)
})
