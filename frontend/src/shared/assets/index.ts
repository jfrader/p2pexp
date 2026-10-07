import { getAddressInfo, Network, validate } from 'bitcoin-address-validation'

export type BitcoinAddress = {
  address: string
  type: string
}

export function parseBitcoinAddress(input: string): BitcoinAddress | null {
  const address = input.trim()
  if (address === '' || !validate(address, Network.mainnet)) return null
  return { address, type: getAddressInfo(address).type }
}
