import { describe, expect, it } from 'vitest'
import { parseBitcoinAddress } from './index'

describe('parseBitcoinAddress', () => {
  it('accepts a mainnet address', () => {
    expect(parseBitcoinAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).toEqual({
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      type: 'p2wpkh',
    })
  })

  it('rejects testnet addresses', () => {
    expect(parseBitcoinAddress('tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx')).toBeNull()
  })

  it('rejects invalid and empty input', () => {
    expect(parseBitcoinAddress('not-an-address')).toBeNull()
    expect(parseBitcoinAddress('')).toBeNull()
  })
})
