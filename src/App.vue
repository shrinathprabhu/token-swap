<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
// import AppLogin from './components/AppLogin.vue'
import AppFooter from './components/AppFooter.vue'
import AppDeposit from './components/AppDeposit.vue'
import AppWithdraw from './components/AppWithdraw.vue'
</script>

<template>
  <main>
    <AppHeader />
    <div>
      <!-- <AppLogin /> -->
      <div>
        <AppDeposit />
        <AppWithdraw />
      </div>
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
