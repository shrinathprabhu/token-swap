<script setup lang="ts">
import { useStateStore } from '@/stores/state'

const state = useStateStore()

async function handleDisconnect() {
  await state.disconnectWallet()
}
</script>

<template>
  <header id="app-header">
    <div class="header-content flex align-center">
      <img src="../assets/images/avail-logo.svg" />
      <button class="button primary" v-if="state.isConnected" @click.stop="handleDisconnect">
        Disconnect
      </button>
    </div>
    <div class="section-bottom-separator"></div>
  </header>
</template>

<style lang="css" scoped>
.header-content {
  justify-content: space-between;
  padding-inline: 2rem;
}

.header-content img {
  height: 2rem;
}

.header-content button {
  height: 3rem;
  width: 8.625rem;
}
</style>
