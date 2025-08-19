<script setup lang="ts">
import { useStateStore } from '@/stores/state'

const state = useStateStore()

async function handleConnect() {
  await state.connectWallet()
}
</script>

<template>
  <div id="app-login" class="center-column">
    <div class="card login flex-col align-center">
      <div class="content flex-col align-center">
        <h2 class="text-center">Arcana Token Swap</h2>
        <p class="description text-center">
          Connect the wallet that contains the XAR tokens on the Ethereum network
        </p>
      </div>
      <button class="button primary" @click.stop="handleConnect">Connect Wallet</button>
    </div>
    <div class="card news">
      <img style="height: 6.875rem; width: 10rem" class="img" />
      <div class="content flex-col">
        <div class="title">Avacquisition</div>
        <div class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </div>
      </div>
      <a href="#" class="button secondary" style="cursor: pointer">View Now</a>
    </div>
  </div>
</template>

<style lang="css" scoped>
.center-column {
  padding-block: 2rem;
}

.login {
  padding: 2.5rem 2rem;
  gap: 2.5rem;
}

.login .content {
  gap: 1.25rem;
}

.login button {
  width: 100%;
}

.description {
  color: var(--color-slate);
  font-size: var(--fs-14);
  line-height: 1.5;
  max-width: 28rem;
}

.login .button {
  height: 3rem;
}

.news {
  display: grid;
  padding: 0.75rem;
  grid-template-columns: 10rem 1fr 6.25rem;
  gap: 1.5rem;
  align-items: center;
}

.news .content {
  gap: 0.75rem;
}

.news .content .title {
  font-size: var(--fs-28);
  line-height: 1.4;
  font-weight: 600;
}

.news .content .title {
  font-size: var(--fs-28);
  line-height: 1.4;
  font-weight: 600;
}

.news .content .description {
  font-size: var(--fs-14);
  line-height: 1.5;
}

.news .button {
  height: 2.5rem;
  width: 6.25rem;
}
</style>
