import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { sepolia } from 'viem/chains'

let publicClient: PublicClient
let walletClient: WalletClient

const rpcUrl = 'https://1rpc.io/sepolia'

export function getPublicClient() {
  if (publicClient) return publicClient
  publicClient = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  })
  return publicClient
}

export function getWalletClient(account: `0x${string}`) {
  if (walletClient) return walletClient
  walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  })
  return walletClient
}
