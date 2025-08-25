<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import CrossIcon from './icons/CrossIcon.vue'

const state = useStateStore()
</script>

<template>
  <div id="app-loader" class="flex align-center justify-center">
    <div class="overlay"></div>
    <div
      class="content card flex-col align-center justify-center text-center"
      style="position: relative; gap: 1rem"
    >
      <button
        style="position: absolute; top: 0.75rem; right: 0.75rem; cursor: pointer"
        @click.stop="state.hideError"
      >
        <CrossIcon style="height: 1.25rem; width: 1.25rem; color: var(--color-light-slate)" />
      </button>
      <img
        src="../assets/images/error-exclamation.svg"
        style="width: 6rem; height: 6rem; border-radius: 50%"
      />
      <span class="loading-message text-center">{{ state.error.message }}</span>
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
