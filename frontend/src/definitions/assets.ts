import { Decimal } from 'decimal.js'
import { getAddressInfo, Network, validate } from 'bitcoin-address-validation'
import { buildBip21 } from '../shared/utils/uri'

export type AssetId = 'btc-onchain'

export type Asset = {
  id: AssetId
  currency: string
  label: string
  network: string
  parseAddress(input: string): string | null
  validateAmount(input: string): string | null
  paymentUri(address: string, amount: string): string
  inspectUrl?(address: string): string
  inspectLabel?: string
}

export const ASSETS: Record<AssetId, Asset> = {
  'btc-onchain': {
    id: 'btc-onchain',
    currency: 'BTC',
    label: 'Bitcoin',
    network: 'Bitcoin mainnet',
    parseAddress: (input) => {
      const address = input.trim()
      if (!validate(address, Network.mainnet)) return null
      return getAddressInfo(address).address
    },
    validateAmount: (input) => {
      try {
        const amount = new Decimal(input.trim())
        if (!amount.isFinite()) return null
        if (amount.isZero() || amount.isNegative()) return null
        if (amount.decimalPlaces() > 8) return null
        return amount.toFixed(amount.decimalPlaces())
      } catch {
        return null
      }
    },
    paymentUri: (address, amount) => buildBip21(address, amount),
    inspectUrl: (address) => `https://mempool.space/address/${address}`,
    inspectLabel: 'Open in mempool.space',
  },
}
