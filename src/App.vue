<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppLogin from './components/AppLogin.vue'
import AppFooter from './components/AppFooter.vue'
import AppDeposit from './components/AppDeposit.vue'
import AppWithdraw from './components/AppWithdraw.vue'
import { useStateStore } from './stores/state'

const state = useStateStore()

state.initAppKit().then(() => {
  state.checkSavedConnection()
})
</script>

<template>
  <main>
    <AppHeader />
    <div style="overflow-y: auto">
      <div v-if="state.isConnected" style="min-height: 100%" class="flex-col justify-center">
        <AppDeposit />
        <AppWithdraw />
      </div>
      <AppLogin v-else />
    </div>
    <AppFooter />
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  width: 100dvw;
  display: grid;
  grid-template-rows: 5rem 1fr 4rem;
}
</style>
