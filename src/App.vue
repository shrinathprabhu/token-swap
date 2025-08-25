<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppLogin from './components/AppLogin.vue'
import AppFooter from './components/AppFooter.vue'
import AppHome from './components/AppHome.vue'
import { useStateStore } from './stores/state'
import AppLoader from './components/AppLoader.vue'
import AppBanner from './components/AppBanner.vue'
import AppError from './components/AppError.vue'
import AppSuccess from './components/AppSuccess.vue'

const state = useStateStore()

state.initAppKit().then(() => {
  state.checkSavedConnection()
})
</script>

<template>
  <main>
    <AppHeader />
    <div style="overflow-y: auto">
      <AppBanner v-if="state.isConnected" />
      <div v-if="state.isConnected" style="min-height: 100%" class="flex-col justify-center">
        <AppHome />
      </div>
      <AppLogin v-else />
    </div>
    <AppFooter />
    <AppLoader v-if="state.loader.loading" />
    <AppError v-if="state.error.show" />
    <AppSuccess v-if="state.success.show" />
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
