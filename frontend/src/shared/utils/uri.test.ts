import { describe, expect, it } from 'vitest'
import { buildBip21 } from './uri'

const TEST_ADDRESS = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'

describe('buildBip21', () => {
  it('encodes the amount', () => {
    expect(buildBip21(TEST_ADDRESS, '0.00015')).toBe(`bitcoin:${TEST_ADDRESS}?amount=0.00015`)
  })

  it('keeps sub-satoshi amounts decimal, not scientific', () => {
    expect(buildBip21(TEST_ADDRESS, '0.00000001')).toBe(`bitcoin:${TEST_ADDRESS}?amount=0.00000001`)
  })
})
