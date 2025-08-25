<script setup lang="ts">
import { useStateStore } from '@/stores/state'

const state = useStateStore()
</script>

<template>
  <div id="app-loader" class="flex align-center justify-center">
    <div class="overlay"></div>
    <div class="content card flex-col align-center justify-center text-center">
      <video autoplay playsinline muted loop style="width: 8rem">
        <source src="../assets/videos/loader.webm" type="video/webm" />
      </video>
      <span class="loading-message text-center">{{ state.loader.message }}</span>
    </div>
  </div>
</template>

<style lang="css" scoped>
#app-loader {
  position: fixed;
  inset: 0;
  z-index: 999999;
  isolation: isolate;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: var(--color-dark);
  opacity: 0.6;
  backdrop-filter: blur(2px);
}

.content {
  z-index: 2;
  padding: 2rem;
  min-width: 20rem;
}

.loading-message {
  font-weight: 600;
  font-size: var(--fs-16);
}
</style>
