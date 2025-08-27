<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import CrossIcon from './icons/CrossIcon.vue'

const state = useStateStore()
</script>

<template>
  <div
    id="app-banner"
    style="background-color: #ffe594cf; padding: 6px; width: 100%; gap: 1rem; position: relative"
    class="flex align-center justify-center text-center"
  >
    <span style="font-size: var(--fs-14); line-height: 1.5"
      ><span style="font-weight: 700">ANNOUNCEMENT:</span>Avail Acquires Arcana To Accelerate
      Multichain Scalability</span
    ><a
      href="https://blog.availproject.org/avail-acquires-arcana-to-accelerate-multichain-scalability/"
      target="_blank"
      class="link"
      >VIEW</a
    >
    <button style="position: fixed; right: 1rem; cursor: pointer" @click.stop="state.hideBanner">
      <CrossIcon />
    </button>
  </div>
</template>
