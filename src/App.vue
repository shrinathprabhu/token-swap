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
import { ref } from 'vue'
import DownIcon from './components/icons/DownIcon.vue'

const state = useStateStore()

const isClickedOnce = ref(false)

state.initAppKit().then(() => {
  state.checkSavedConnection()
})

function handleScrollClick() {
  document.getElementById('app-withdraw')?.scrollIntoView({ behavior: 'smooth' })
  isClickedOnce.value = true
}
</script>

<template>
  <main>
    <AppHeader />
    <div style="overflow-y: auto">
      <AppBanner v-if="state.isConnected && state.showBanner" />
      <div v-if="state.isConnected" style="min-height: 100%" class="flex-col justify-center">
        <AppHome />
      </div>
      <AppLogin v-else />
    </div>
    <AppFooter />
    <AppLoader v-if="state.loader.loading" />
    <AppError v-if="state.error.show" />
    <AppSuccess v-if="state.success.show" />
    <button v-if="!isClickedOnce" class="scroll-button" @click.stop="handleScrollClick">
      <DownIcon />
    </button>
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

.scroll-button {
  position: fixed;
  right: 1.5rem;
  bottom: 5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1d2a31;
  color: #f7f7f7;
}

.scroll-button * {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
