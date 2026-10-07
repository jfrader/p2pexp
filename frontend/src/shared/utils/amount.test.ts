import { describe, expect, it } from 'vitest'
import { formatSats, parseBtcToSats, satsToBtc } from './amount'

describe('parseBtcToSats', () => {
  it('parses whole bitcoins', () => {
    expect(parseBtcToSats('1')).toBe(100_000_000)
    expect(parseBtcToSats('0')).toBe(0)
  })

  it('parses decimals up to 8 places', () => {
    expect(parseBtcToSats('0.5')).toBe(50_000_000)
    expect(parseBtcToSats('0.00000001')).toBe(1)
    expect(parseBtcToSats('1.12345678')).toBe(112_345_678)
  })

  it('rejects more than 8 decimal places', () => {
    expect(parseBtcToSats('1.123456789')).toBeNull()
  })

  it('rejects invalid and negative input', () => {
    expect(parseBtcToSats('')).toBeNull()
    expect(parseBtcToSats('abc')).toBeNull()
    expect(parseBtcToSats('-1')).toBeNull()
  })

  it('rejects amounts beyond safe integers', () => {
    expect(parseBtcToSats('100000000')).toBeNull()
  })
})

describe('satsToBtc', () => {
  it('formats sats as plain decimal BTC', () => {
    expect(satsToBtc(1)).toBe('0.00000001')
    expect(satsToBtc(100_000_000)).toBe('1')
    expect(satsToBtc(15_000)).toBe('0.00015')
  })
})

describe('formatSats', () => {
  it('groups thousands', () => {
    expect(formatSats(1_500)).toBe('1,500 sats')
  })
})
