import { describe, expect, it } from 'vitest'
import { ASSETS } from './assets'

const bitcoin = ASSETS['btc-onchain']

describe('btc-onchain asset', () => {
  it('accepts a mainnet address', () => {
    expect(bitcoin.parseAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).toBe(
      'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    )
  })

  it('rejects testnet addresses', () => {
    expect(bitcoin.parseAddress('tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx')).toBeNull()
  })

  it('rejects invalid and empty input', () => {
    expect(bitcoin.parseAddress('not-an-address')).toBeNull()
    expect(bitcoin.parseAddress('')).toBeNull()
  })

  it('accepts plain decimal amounts', () => {
    expect(bitcoin.validateAmount('0.0015')).toBe('0.0015')
    expect(bitcoin.validateAmount('1')).toBe('1')
    expect(bitcoin.validateAmount('2100')).toBe('2100')
    expect(bitcoin.validateAmount('0.00000001')).toBe('0.00000001')
  })

  it('normalizes trailing zeros and bare dots', () => {
    expect(bitcoin.validateAmount('1.10000000')).toBe('1.1')
    expect(bitcoin.validateAmount('0.100')).toBe('0.1')
    expect(bitcoin.validateAmount('1.0')).toBe('1')
    expect(bitcoin.validateAmount('1.')).toBe('1')
    expect(bitcoin.validateAmount('.5')).toBe('0.5')
  })

  it('trims surrounding whitespace', () => {
    expect(bitcoin.validateAmount(' 0.0015 ')).toBe('0.0015')
  })

  it('rejects zero', () => {
    expect(bitcoin.validateAmount('0')).toBeNull()
    expect(bitcoin.validateAmount('0.0')).toBeNull()
    expect(bitcoin.validateAmount('0.000')).toBeNull()
  })

  it('rejects negatives', () => {
    expect(bitcoin.validateAmount('-1')).toBeNull()
    expect(bitcoin.validateAmount('-0.5')).toBeNull()
  })

  it('rejects more than 8 decimals', () => {
    expect(bitcoin.validateAmount('0.000000001')).toBeNull()
  })

  it('rejects units, commas and junk', () => {
    expect(bitcoin.validateAmount('0.0015 BTC')).toBeNull()
    expect(bitcoin.validateAmount('1,500')).toBeNull()
    expect(bitcoin.validateAmount('abc')).toBeNull()
    expect(bitcoin.validateAmount('')).toBeNull()
  })

  it('builds a payment URI', () => {
    expect(bitcoin.paymentUri('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', '0.00015')).toBe(
      'bitcoin:bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4?amount=0.00015',
    )
  })

  it('builds a mempool.space inspect link', () => {
    expect(bitcoin.inspectUrl?.('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).toBe(
      'https://mempool.space/address/bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    )
    expect(bitcoin.inspectLabel).toBe('Open in mempool.space')
  })
})
