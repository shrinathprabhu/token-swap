import { ref, readonly } from 'vue'
import { defineStore } from 'pinia'

import { createAppKit } from '@reown/appkit/vue'
import { mainnet, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const useStateStore = defineStore('state', () => {
  const isConnected = ref(false)
  const modal = ref<ReturnType<typeof createAppKit>>()

  async function initAppKit() {
    const projectId = import.meta.env.VITE_APP_REOWN_PROJECT_ID

    const metadata = {
      name: 'Avail Swap',
      description: 'Service to deposit XAR and get AVAIL',
      url: 'https://swap.availproject.org',
      icons: ['https://www.availproject.org/favicon.ico'],
    }

    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet]

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
    if (account?.address) isConnected.value = true
    console.log(account)
    modal.value?.subscribeEvents(async (ev) => {
      switch (ev.data.event) {
        case 'DISCONNECT_SUCCESS': {
          localStorage.clear()
          isConnected.value = false
          return
        }
        case 'CONNECT_SUCCESS': {
          isConnected.value = true
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

  return {
    isConnected: readonly(isConnected),
    connectWallet,
    disconnectWallet,
    initAppKit,
    checkSavedConnection,
  }
})
