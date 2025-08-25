<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { getTransactionUrl, unlock1Time, unlock2Time, XARToAvailDivisor } from '@/utils/constants'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { computed } from 'vue'

const state = useStateStore()
const xarDecimals = Decimal.pow(10, 18)

const unlockTokens = computed(() => {
  const totalWithdrawable = Decimal.div(state.depositAmount, XARToAvailDivisor)
  const halfValue = totalWithdrawable.div(2).floor().div(xarDecimals)
  return [halfValue.toFixed(), halfValue.toFixed()]
})

const depositAmount = computed(() => {
  return Decimal.div(state.depositAmount, xarDecimals).toFixed()
})

const isUnlock1 = computed(() => unlock1Time < dayjs())

const isUnlock2 = computed(() => unlock2Time < dayjs())

async function handleWithdraw(phase: number) {
  try {
    state.showLoader(`Withdrawing AVAIL...`)
    const res = await state.withdraw(phase)
    await state.fetchDetails()
    state.showSuccess(`Withdraw Success`, getTransactionUrl(res))
  } catch (e) {
    console.log('Error on Withdraw', e)
    state.showError(
      'Transaction Execution Reverted',
      // eslint-disable-next-line
      (e as any)?.data?.receipt?.transactionHash
        ? // eslint-disable-next-line
          getTransactionUrl((e as any).data.receipt.transactionHash)
        : undefined,
    )
  } finally {
    state.hideLoader()
  }
}
</script>

<template>
  <div id="app-withdraw" class="card flex-col align-center" style="gap: 1rem">
    <h2 style="margin-bottom: 1.5rem">Withdrawal Schedule</h2>
    <div
      v-if="Number(depositAmount)"
      class="flex withdraw-card justify-between align-center"
      style="background-color: #eef0f8"
    >
      <span style="font-size: var(--fs-20); font-weight: 500">Total XAR Deposited</span>
      <div class="flex align-center justify-center" style="gap: 0.5rem; font-weight: 500">
        <img
          src="../assets/images/xar-token.svg"
          style="width: 2rem; height: 2rem; border-radius: 50%"
        />
        <span style="font-size: var(--fs-24)"
          >{{ depositAmount }} <span style="font-size: var(--fs-16)">XAR</span></span
        >
      </div>
    </div>
    <div class="flex-col withdraw-card" style="gap: 1rem">
      <div class="flex justify-between align-center">
        <span :class="['text-light-slate', Number(state.depositAmount) ? 'deposited' : '']"
          >Unlock 1</span
        >
        <div class="withdraw-chip green" v-if="state.withdrew[0]">Completed</div>
        <div class="withdraw-chip" v-else-if="isUnlock1">Withdraw today</div>
        <div class="withdraw-chip" v-else>
          Withdraw on
          <span style="font-weight: 500">{{ unlock1Time.format('MMMM DD, YYYY') }}</span>
        </div>
      </div>
      <div v-if="Number(depositAmount)" class="flex justify-between align-center">
        <span style="font-size: var(--fs-20); font-weight: 500">Total AVAIL Allocated</span>
        <div class="flex align-center justify-center" style="gap: 0.5rem; font-weight: 500">
          <img
            src="../assets/images/avail-token.svg"
            style="width: 2rem; height: 2rem; border-radius: 50%"
          />
          <span style="font-size: var(--fs-24)"
            >{{ unlockTokens[0] }} <span style="font-size: var(--fs-16)">XAR</span></span
          >
        </div>
      </div>
      <div v-if="Number(depositAmount) || state.withdrew[0]">
        <a
          v-if="state.withdrew[0]"
          target="_blank"
          class="button secondary withdraw"
          :href="getTransactionUrl(state.withdrew[0])"
          >View Transaction</a
        >
        <button
          v-else
          class="button primary withdraw"
          :disabled="!isUnlock1"
          @click.stop="() => handleWithdraw(0)"
        >
          Withdraw
        </button>
      </div>
    </div>
    <div class="flex-col withdraw-card" style="gap: 1rem">
      <div class="flex justify-between align-center">
        <span :class="['text-light-slate', Number(state.depositAmount) ? 'deposited' : '']"
          >Unlock 2</span
        >
        <div class="withdraw-chip green" v-if="state.withdrew[1]">Completed</div>
        <div class="withdraw-chip" v-else-if="isUnlock2">Withdraw today</div>
        <div class="withdraw-chip" v-else>
          Withdraw on
          <span style="font-weight: 500">{{ unlock2Time.format('MMMM DD, YYYY') }}</span>
        </div>
      </div>
      <div v-if="Number(depositAmount)" class="flex justify-between align-center">
        <span style="font-size: var(--fs-20); font-weight: 500">Total AVAIL Allocated</span>
        <div class="flex align-center justify-center" style="gap: 0.5rem; font-weight: 500">
          <img
            src="../assets/images/avail-token.svg"
            style="width: 2rem; height: 2rem; border-radius: 50%"
          />
          <span style="font-size: var(--fs-24)"
            >{{ unlockTokens[1] }} <span style="font-size: var(--fs-16)">XAR</span></span
          >
        </div>
      </div>
      <div v-if="Number(depositAmount) || state.withdrew[1]">
        <a
          v-if="state.withdrew[1]"
          target="_blank"
          class="button secondary withdraw"
          :href="getTransactionUrl(state.withdrew[1])"
          >View Transaction</a
        >
        <button
          v-else
          class="button primary withdraw"
          :disabled="!isUnlock2"
          @click.stop="() => handleWithdraw(1)"
        >
          Withdraw
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.withdraw-card {
  background-color: var(--color-light-card);
  width: 100%;
  padding: 1.25rem 1.25rem;
  border-radius: 0.75rem;
}

.text-light-slate {
  font-weight: 500;
  line-height: 1.5;
  font-size: var(--fs-24);
  color: var(--color-dark);
}

.text-light-slate.deposited {
  text-transform: uppercase;
  font-weight: 700;
}

.desc {
  line-height: 1.5;
  font-size: var(--fs-24);
  font-weight: 500;
}

.button.withdraw {
  height: 3rem;
  width: 100%;
}

.withdraw-chip {
  background-color: var(--color-blue-fade);
  color: var(--color-alert-blue);
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: var(--fs-16);
  line-height: 1;
}

.withdraw-chip.green {
  background-color: var(--color-green-fade);
  color: var(--color-green);
}
</style>
