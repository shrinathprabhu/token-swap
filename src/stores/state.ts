import { ref, readonly } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', () => {
  const isConnected = ref(false)

  function connectWallet() {
    isConnected.value = true
  }

  function disconnectWallet() {
    isConnected.value = false
  }

  return { isConnected: readonly(isConnected), connectWallet, disconnectWallet }
})
