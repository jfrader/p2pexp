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
    throw error
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
  await page.waitForSelector('text=Invoices', { timeout: 20000 })
  await page.waitForFunction(
    () => {
      const button = [...document.querySelectorAll('button')].find((b) =>
        b.textContent.includes('Save'),
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
  let stepError = null
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
    page.on('dialog', (dialog) => dialog.accept())

    await step('app boots to invoices screen', async () => {
      await page.waitForSelector('text=Invoices', { timeout: 20000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '1-boot.png') })
    })

    await step('autopass connects (share button enabled)', async () => {
      await connect(page)
      await page.screenshot({ path: path.join(ARTIFACTS, '2-ready.png') })
    })

    await step('invalid on-chain address is rejected', async () => {
      await page.fill('input[name="total"]', '0.0015')
      await page.fill('input[name="address"]', 'not-an-address')
      await page.click('button:has-text("Save")')
      await page.waitForSelector('text=Invalid address', { timeout: 5000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '3-invalid-address.png') })
    })

    await step('valid on-chain invoice is created with QR', async () => {
      await page.fill('input[name="total"]', '0.0015')
      await page.fill('input[name="address"]', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
      await page.click('button:has-text("Save")')
      await page.getByRole('tab', { name: 'Invoices' }).click()
      await page.waitForSelector('text=Open', { timeout: 10000 })
      await page.waitForSelector('svg[width="180"]', { timeout: 5000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '4-invoice-card.png') })
    })

    await step('invoice shows the total', async () => {
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
      await copy.click()
      await page.waitForFunction(
        () => {
          const button = document.querySelector('[aria-label="Copy destination"]')
          const svg = button && button.querySelector('svg')
          return svg !== null && window.getComputedStyle(svg).opacity === '0.5'
        },
        { timeout: 10000 },
      )
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

    await step('amount validation cases', async () => {
      await page.getByRole('tab', { name: 'New invoice' }).click()
      await page.fill('input[name="address"]', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
      const cases = [
        ['', 'Enter a valid amount'],
        ['0', 'Enter a valid amount'],
        ['-1', 'Enter a valid amount'],
        ['0.000000001', 'Enter a valid amount'],
        ['0.0015 BTC', 'Enter a valid amount'],
      ]
      for (const [value, message] of cases) {
        await page.fill('input[name="total"]', value)
        await page.click('button:has-text("Save")')
        await page.waitForSelector(`text=${message}`, { timeout: 5000 })
      }
      await page.screenshot({ path: path.join(ARTIFACTS, '8-amount-errors.png') })
    })

    await step('empty and testnet addresses are rejected', async () => {
      await page.fill('input[name="total"]', '0.0015')
      await page.fill('input[name="address"]', '')
      await page.click('button:has-text("Save")')
      await page.waitForSelector('text=Enter a Bitcoin address', { timeout: 5000 })
      await page.fill('input[name="address"]', 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx')
      await page.click('button:has-text("Save")')
      await page.waitForSelector('text=Invalid address', { timeout: 5000 })
    })

    await step('full form fits without scrolling', async () => {
      await page.getByRole('tab', { name: 'Invoices' }).click()
      await page.getByRole('tab', { name: 'New invoice' }).click()
      await page.fill('input[name="address"]', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
      const cut = await page.evaluate(() => {
        const button = [...document.querySelectorAll('button')].find((b) =>
          b.textContent.includes('Save'),
        )
        let container = button && button.parentElement
        while (container && getComputedStyle(container).overflowY !== 'auto') {
          container = container.parentElement
        }
        if (container === null) return true
        return button.getBoundingClientRect().bottom > container.getBoundingClientRect().bottom
      })
      if (cut) throw new Error('save button is cut by the viewport bottom')
    })

    await step('full invoice with details is created', async () => {
      await page.getByLabel('Description').fill('consulting')
      await page.fill('input[name="from"]', 'Alice')
      await page.fill('input[name="to"]', 'Bob')
      await page.fill('input[name="total"]', '0.002')
      await page.click('button:has-text("Save")')
      await page.waitForSelector('text=Open', { timeout: 10000 })
      await page.waitForSelector('text=consulting', { timeout: 5000 })
      await page.waitForSelector('text=0.002 BTC', { timeout: 5000 })
      await page.waitForSelector('text=Alice → Bob', { timeout: 5000 })
      await page.screenshot({ path: path.join(ARTIFACTS, '9-full-invoice.png') })
    })

    await step('full invoice is removed', async () => {
      await page.click('button:has-text("Remove")')
      await page.waitForSelector('text=No invoices yet', { timeout: 10000 })
    })
  } catch (error) {
    stepError = error
  } finally {
    if (browser) await browser.close().catch(() => {})
    if (child.exitCode === null) {
      child.kill('SIGTERM')
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 5000)
        child.once('exit', () => {
          clearTimeout(timer)
          resolve()
        })
      })
    }
  }

  console.log('\n=== SUMMARY ===')
  for (const result of results) console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name}`)
  console.log(`\nArtifacts: ${ARTIFACTS}`)
  if (stepError !== null || results.some((result) => !result.ok)) process.exit(1)
}

main().catch((error) => {
  console.error('RUNNER ERROR', error)
  process.exit(1)
})
