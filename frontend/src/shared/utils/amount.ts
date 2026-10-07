import { Decimal } from 'decimal.js'
import numeral from 'numeral'

const SATS_PER_BTC = 100_000_000

export function parseBtcToSats(input: string): number | null {
  let value: Decimal
  try {
    value = new Decimal(input.trim())
  } catch {
    return null
  }
  if (!value.isFinite() || value.isNegative() || value.decimalPlaces() > 8) return null
  const sats = value.times(SATS_PER_BTC)
  if (sats.greaterThan(Number.MAX_SAFE_INTEGER)) return null
  return sats.toNumber()
}

export function satsToBtc(sats: number): string {
  return new Decimal(sats).div(SATS_PER_BTC).toFixed(8).replace(/0+$/, '').replace(/\.$/, '')
}

export function formatSats(sats: number): string {
  return `${numeral(sats).format('0,0')} sats`
}
