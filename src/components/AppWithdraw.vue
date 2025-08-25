<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { XARToAvailDivisor } from '@/utils/constants'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { computed } from 'vue'

const state = useStateStore()
const xarDecimals = Decimal.pow(10, 18)

const unlockTokens = computed(() => {
  const tokensDeposited = state.depositAmout
  const totalWithdrawable = Decimal.div(tokensDeposited, XARToAvailDivisor)
  const halfValue = totalWithdrawable.div(2).floor().div(xarDecimals)
  return [halfValue.toFixed(), halfValue.toFixed()]
})

const isUnlock1 = computed(() => {
  if (state.depositUnlocked) {
    return true
  }
  const unlockPhase = dayjs('02-28-2026-00:00Z')
  const current = dayjs()
  return unlockPhase < current
})

const isUnlock2 = computed(() => {
  if (state.depositUnlocked) {
    return true
  }
  const unlockPhase = dayjs('08-28-2026-00:00Z')
  const current = dayjs()
  return unlockPhase < current
})
</script>

<template>
  <div id="app-withdraw" class="card flex-col align-center" style="gap: 1rem">
    <h2 style="margin-bottom: 1.5rem">AVAIL Tokens</h2>
    <div class="flex withdraw-card justify-between align-center">
      <div class="flex-col">
        <span class="text-light-slate">UNLOCK 1</span>
        <span class="font-inter desc">{{ unlockTokens[0] }} AVAIL on Feb 28, 2026</span>
      </div>
      <button class="button primary withdraw" :disabled="!isUnlock1">Withdraw</button>
    </div>
    <div class="flex withdraw-card justify-between align-center">
      <div class="flex-col">
        <span class="text-light-slate">UNLOCK 2</span>
        <span class="font-inter desc">{{ unlockTokens[1] }} AVAIL on Aug 28, 2026</span>
      </div>
      <button class="button primary withdraw" :disabled="!isUnlock2">Withdraw</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.withdraw-card {
  background-color: var(--color-light-card);
  width: 100%;
  padding: 1.25rem 0.75rem;
  border-radius: 0.75rem;
}

.text-light-slate {
  font-weight: 600;
  line-height: 1.5;
  font-size: var(--fs-16);
}

.desc {
  line-height: 1.5;
  font-size: var(--fs-24);
  font-weight: 500;
}

.button.withdraw {
  height: 3rem;
  width: 8.625rem;
}
</style>
