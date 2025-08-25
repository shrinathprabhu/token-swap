import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { sepolia } from 'viem/chains'

let publicClient: PublicClient
let walletClient: WalletClient

export const sepoliaRpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com'
export const mainnetRpcUrl = 'https://ethereum-rpc.publicnode.com'

export function getPublicClient() {
  if (publicClient) return publicClient
  publicClient = createPublicClient({
    chain: sepolia,
    transport: http(sepoliaRpcUrl),
  })
  return publicClient
}

// eslint-disable-next-line
type EthereumProvider = { request(...args: any): Promise<any> }

export function getWalletClient(account: `0x${string}`, provider: EthereumProvider) {
  if (walletClient) return walletClient
  walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: custom(provider),
  })
  return walletClient
}
