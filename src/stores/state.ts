import { ref, readonly, reactive } from 'vue'
import { defineStore } from 'pinia'

import { createAppKit } from '@reown/appkit/vue'
import { mainnet, sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { getPublicClient, getWalletClient, sepoliaRpcUrl, mainnetRpcUrl } from '@/utils/client'
import { stakeContract, xarContract } from '@/utils/constants'
import { stakeAbi, xarAbi } from '@/utils/abi'
import Decimal from 'decimal.js'

export const useStateStore = defineStore('state', () => {
  const isConnected = ref(false)
  const loader = reactive({
    loading: false,
    message: '',
  })
  const error = reactive({
    message: '',
    show: false,
  })
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
      customRpcUrls: {
        'eip155:11155111': [{ url: sepoliaRpcUrl }],
        'eip155:1': [{ url: mainnetRpcUrl }],
      },
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
      showLoader('Fetching Details, Please Wait...')
      address.value = account.address
      isConnected.value = true
      hideLoader()
      await fetchDetails()
    }
    console.log(account)
    modal.value?.subscribeEvents(async (ev) => {
      console.log('Web3Modal Events', ev)
      switch (ev.data.event) {
        case 'DISCONNECT_SUCCESS': {
          localStorage.clear()
          isConnected.value = false
          return
        }
        case 'INITIALIZE':
        case 'CONNECT_SUCCESS': {
          showLoader('Fetching Details, Please Wait...')
          address.value = (await modal.value!.getAccount()?.address) || '0x'
          isConnected.value = true
          await fetchDetails()
          hideLoader()
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
    console.log('Params', address.value)
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
    const client = getWalletClient(address.value, modal.value!.getProvider('eip155')!)
    console.log('Deposit', amount)
    const response = await client.writeContract({
      address: stakeContract,
      abi: stakeAbi,
      functionName: 'deposit',
      args: [amount],
      chain: sepolia,
      account: address.value,
    })
    const pClient = getPublicClient()
    const receipt = await pClient.waitForTransactionReceipt({
      hash: response,
    })
    console.log('Deposit Response', response, receipt)
    if (receipt.status === 'reverted') {
      console.log('Reverting and throwing error')
      throw {
        name: 'Reverted',
        message: 'Transaction Execution Reverted',
        data: {
          receipt,
        },
      }
    }
    return response
  }

  async function withdraw() {
    const client = getWalletClient(address.value, modal.value!.getProvider('eip155')!)
    const response = await client.writeContract({
      address: stakeContract,
      abi: stakeAbi,
      functionName: 'withdraw',
      chain: sepolia,
      account: address.value,
    })
    const pClient = getPublicClient()
    const receipt = await pClient.waitForTransactionReceipt({
      hash: response,
    })
    console.log('Deposit Response', response, receipt)
    if (receipt.status === 'reverted') {
      console.log('Reverting and throwing error')
      throw {
        name: 'Reverted',
        message: 'Transaction Execution Reverted',
        data: {
          receipt,
        },
      }
    }
    return response
  }

  async function getDeposits() {
    console.log('getting deposits')
    const client = getPublicClient()
    const response = await client.readContract({
      address: stakeContract,
      abi: stakeAbi,
      functionName: 'deposits',
      args: [address.value],
    })
    console.log('deposits', response)
    // depositAmount.value = response[0].toString()
    // depositUnlocked.value = response[1]
    depositUnlocked.value = true
    depositAmount.value = new Decimal(10).mul(Decimal.pow(10, 18)).toFixed()
    return response
  }

  async function fetchDetails() {
    if (address.value === '0x') {
      address.value = (await modal.value?.getAccount())?.address || '0x'
    }
    if (address.value === '0x') return
    await Promise.all([fetchXARBalance(), getDeposits()])
  }

  function showLoader(message: string) {
    loader.loading = true
    loader.message = message
  }

  function hideLoader() {
    loader.loading = false
    loader.message = ''
  }

  function showError(message: string) {
    error.show = true
    error.message = message
  }

  function hideError() {
    error.show = false
    error.message = ''
  }

  return {
    isConnected: readonly(isConnected),
    xarBalance: readonly(xarBalance),
    loader: readonly(loader),
    error: readonly(error),
    depositAmount: readonly(depositAmount),
    depositUnlocked: readonly(depositUnlocked),
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
    showLoader,
    hideLoader,
    showError,
    hideError,
  }
})
