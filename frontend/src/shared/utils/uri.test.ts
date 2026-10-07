import { describe, expect, it } from 'vitest'
import { InvoiceSchema, type InvoiceRecord } from '../../invoices/schema'
import { buildBip21, inspectUrl } from './uri'

const TEST_ADDRESS = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'

function onchainRecord(description?: string): InvoiceRecord {
  return InvoiceSchema.parse({
    v: 1,
    id: 'a',
    amountSats: 15_000,
    address: TEST_ADDRESS,
    description,
    createdAt: '2026-10-07T12:00:00.000Z',
  })
}

describe('buildBip21', () => {
  it('encodes amount and message', () => {
    expect(buildBip21(TEST_ADDRESS, 15_000, 'Hello World')).toBe(
      `bitcoin:${TEST_ADDRESS}?amount=0.00015&message=Hello%20World`,
    )
  })

  it('encodes amount only when there is no message', () => {
    expect(buildBip21(TEST_ADDRESS, 15_000)).toBe(`bitcoin:${TEST_ADDRESS}?amount=0.00015`)
  })

  it('keeps sub-satoshi amounts decimal, not scientific', () => {
    expect(buildBip21(TEST_ADDRESS, 1)).toBe(`bitcoin:${TEST_ADDRESS}?amount=0.00000001`)
  })
})

describe('inspectUrl', () => {
  it('links addresses on mempool.space', () => {
    expect(inspectUrl(onchainRecord())).toBe(`https://mempool.space/address/${TEST_ADDRESS}`)
  })
})
