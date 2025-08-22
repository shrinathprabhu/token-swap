import { ref, readonly } from 'vue'
import { defineStore } from 'pinia'

import { createAppKit } from '@reown/appkit/vue'
import { mainnet, sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { getPublicClient, getWalletClient } from '@/utils/client'
import { stakeContract, xarContract } from '@/utils/constants'
import { stakeAbi, xarAbi } from '@/utils/abi'

export const useStateStore = defineStore('state', () => {
  const isConnected = ref(false)
  const address = ref('0x' as `0x${string}`)
  const xarBalance = ref('0')
  const depositAmount = ref('0')
  const depositUnlocked = ref(false)
  const modal = ref<ReturnType<typeof createAppKit>>()

  async function initAppKit() {
    const projectId = import.meta.env.VITE_APP_REOWN_PROJECT_ID

    const metadata = {
      name: 'Avail Swap',
      description: 'Service to deposit XAR and get AVAIL',
      url: window.location.origin,
      icons: ['https://www.availproject.org/favicon.ico'],
    }

    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia]

    const wagmiAdapter = new WagmiAdapter({
      networks,
      projectId,
    })

    modal.value = createAppKit({
      adapters: [wagmiAdapter],
      networks,
      projectId,
      metadata,
      features: {
        analytics: true, // Optional - defaults to your Cloud configuration
      },
    })
  }

  async function checkSavedConnection() {
    const account = modal.value?.getAccount()
    if (account?.address) {
      address.value = account.address
      isConnected.value = true
      await fetchDetails()
    }
    console.log(account)
    modal.value?.subscribeEvents(async (ev) => {
      switch (ev.data.event) {
        case 'DISCONNECT_SUCCESS': {
          localStorage.clear()
          isConnected.value = false
          return
        }
        case 'CONNECT_SUCCESS': {
          address.value =
            (ev.data.address as `0x${string}`) || (await modal.value!.getAccount())?.address || '0x'
          isConnected.value = true
          await fetchDetails()
          return
        }
        default:
          break
      }
    })
  }

  async function connectWallet() {
    await modal.value?.open()
  }

  async function disconnectWallet() {
    localStorage.clear()
    await modal.value?.disconnect()
    isConnected.value = false
  }

  async function fetchXARBalance() {
    const client = getPublicClient()
    const balance = await client.readContract({
      address: xarContract,
      abi: xarAbi,
      functionName: 'balanceOf',
      args: [address.value],
    })
    xarBalance.value = balance.toString()
    return balance
  }

  async function deposit(amount: bigint) {
    const client = getWalletClient(address.value)
    const response = await client.writeContract({
      address: stakeContract,
      abi: stakeAbi,
      functionName: 'deposit',
      args: [amount],
      chain: sepolia,
      account: address.value,
    })
    return response
  }

  async function withdraw() {
    const client = getWalletClient(address.value)
    const response = await client.writeContract({
      address: stakeContract,
      abi: stakeAbi,
      functionName: 'withdraw',
      chain: sepolia,
      account: address.value,
    })
    return response
  }

  async function getDeposits() {
    const client = getPublicClient()
    const response = await client.readContract({
      address: stakeContract,
      abi: stakeAbi,
      functionName: 'deposits',
      args: [address.value],
    })
    depositAmount.value = response[0].toString()
    depositUnlocked.value = response[1]
    return response
  }

  async function fetchDetails() {
    await Promise.all([fetchXARBalance(), getDeposits()])
  }

  return {
    isConnected: readonly(isConnected),
    xarBalance: readonly(xarBalance),
    //
    connectWallet,
    disconnectWallet,
    initAppKit,
    checkSavedConnection,
    fetchXARBalance,
    deposit,
    withdraw,
    getDeposits,
    fetchDetails,
  }
})
