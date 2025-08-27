import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { mainnet } from 'viem/chains'

let publicClient: PublicClient
let walletClient: WalletClient

export const mainnetRpcUrl = 'https://ethereum-rpc.publicnode.com'

export function getPublicClient() {
  if (publicClient) return publicClient
  publicClient = createPublicClient({
    chain: mainnet,
    transport: http(mainnetRpcUrl),
  })
  return publicClient
}

// eslint-disable-next-line
type EthereumProvider = { request(...args: any): Promise<any> }

export function getWalletClient(account: `0x${string}`, provider: EthereumProvider) {
  if (walletClient) return walletClient
  walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: custom(provider),
  })
  return walletClient
}
