<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import ArrowUpIcon from './icons/ArrowUpIcon.vue'
import Decimal from 'decimal.js'
import InfoCircleIcon from './icons/InfoCircleIcon.vue'
import dayjs from 'dayjs'
import { useStateStore } from '@/stores/state'
import { XARToAvailDivisor } from '@/utils/constants'

const state = useStateStore()
const xarAmount = ref('0.00')
const xarDecimals = Decimal.pow(10, 18)
const xarAvailable = computed(() => new Decimal(state.xarBalance).div(xarDecimals).toFixed())
const inputXar = ref<HTMLInputElement | null>()
const inputAvail = ref<HTMLInputElement | null>()

const isSimulated = reactive({
  expired: false,
  deadline: false,
  unlock1: false,
  unlock2: false,
})

function getWidthFromText(text: string) {
  const windowSize = window.innerWidth
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  context.font = `500 ${windowSize > 767 ? '24' : '21'}px Inter`
  const metrics = context.measureText(text)
  const textWidth = metrics.width
  canvas.remove()
  return textWidth + (windowSize > 767 ? 16 : 14)
}

window.simulateDeadline = function (expired = false, revert = false) {
  if (expired) isSimulated.expired = revert ? false : true
  isSimulated.deadline = revert ? false : true
}

window.simulateUnlock = function (num = 1, revert = false) {
  if (num === 1) {
    isSimulated.unlock1 = revert ? false : true
  } else {
    isSimulated.unlock2 = revert ? false : true
  }
}

const availAmount = computed(() => {
  if (!xarAmount.value) return '0'
  return Decimal.div(xarAmount.value, XARToAvailDivisor).toFixed()
})

const isDeadlineNear = computed(() => {
  if (isSimulated.deadline) {
    return true
  }
  return dayjs('02-28-2026-00:00Z').subtract(15, 'days') < dayjs()
})

const isDeadlineOver = computed(() => {
  if (isSimulated.expired) {
    return true
  }
  return dayjs('02-28-2026-00:00Z') < dayjs()
})

function handleXARChange() {
  if (!xarAmount.value) return
  const textWidth = getWidthFromText(xarAmount.value)
  if (inputXar.value) {
    inputXar.value.style.width = `${textWidth}px`
    if (new Decimal(xarAmount.value || 0).greaterThan(xarAvailable.value || 0)) {
      inputXar.value.setCustomValidity('Entered amount is greater than MAX')
    } else {
      inputXar.value.setCustomValidity('')
    }
  }
}

function handleAVAILChange() {
  if (availAmount.value === undefined) return
  const textWidth = getWidthFromText(availAmount.value)
  if (inputAvail.value) inputAvail.value.style.width = `${textWidth}px`
}

function handleInput(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode
  // Allow digits (0-9) and a single decimal point
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }
  // Prevent multiple decimal points
  if (charCode === 46 && xarAmount.value.includes('.')) {
    event.preventDefault()
  }
}

async function handleDeposit() {
  try {
    state.showLoader(`Depositing ${xarAmount.value} XAR...`)
    await state.deposit(BigInt(new Decimal(xarAmount.value).mul(xarDecimals).floor().toFixed()))
    xarAmount.value = '0.00'
    await state.fetchDetails()
  } catch (e) {
    console.log('Error on Deposit', e)
    // eslint-disable-next-line
    state.showError((e as any).message)
  } finally {
    state.hideLoader()
  }
}

watch(xarAmount, handleXARChange, { immediate: true })
watch(availAmount, handleAVAILChange, { immediate: true })
</script>

<template>
  <div class="card flex-col align-center" style="gap: 1rem">
    <h2 class="text-center">Deposit XAR</h2>
    <p class="text-center" style="font-size: var(--fs-16)">
      <span class="text-slate">Deposit your XAR token to initiate the conversion to AVAIL.</span>
      <br />
      <span class="text-slate" style="font-weight: 600">4 XAR = 1 AVAIL</span>
    </p>
    <form @submit.prevent="" class="flex-col" style="gap: 1rem">
      <div class="font-inter">
        <label for="xar-amt">Enter Deposit Amount</label>
        <div class="text-input justify-between">
          <div class="flex align-center">
            <img class="token-img" src="../assets/images/xar-token.svg" />
            <input
              id="xar-amt"
              ref="inputXar"
              type="text"
              pattern="[0-9]*\.?[0-9]+"
              v-model="xarAmount"
              style="width: 4rem"
              @keypress="handleInput"
              @focusout="!xarAmount && (xarAmount = '0.00')"
            />
            <span class="token">XAR</span>
          </div>
          <div class="flex align-center">
            <div class="separator"></div>
            <button
              type="button"
              class="max-button flex justify-center align-center"
              @click.stop="xarAmount = xarAvailable"
            >
              <ArrowUpIcon />
              <span>MAX</span>
            </button>
          </div>
        </div>
        <div class="flex align-center justify-between message-container" style="margin-top: 2px">
          <div>
            <span class="error-message">Insufficient Balance</span>
          </div>
          <span style="font-weight: 500; font-size: var(--fs-12); text-align: right"
            >XAR Available: {{ xarAvailable }}</span
          >
        </div>
      </div>
      <div class="font-inter">
        <label for="avail-amt">You Will Receive</label>
        <div
          class="text-input"
          :class="{
            disabled:
              !xarAmount || new Decimal(xarAmount || 0).equals(0) || !inputXar?.validity.valid,
          }"
        >
          <img class="token-img" src="../assets/images/avail-token.svg" />
          <input
            id="avail-amt"
            style="width: 2rem"
            ref="inputAvail"
            type="text"
            readonly
            v-model="availAmount"
          />
          <span class="token">AVAIL</span>
        </div>
      </div>
      <div class="alert-chip" :class="{ blue: !isDeadlineNear, orange: isDeadlineNear }">
        <InfoCircleIcon style="height: 1.25rem; width: 1.25rem" />
        <span
          >The final deadline for deposit is February 28, 2026. No deposits will be accepted after
          this date.</span
        >
      </div>
      <button
        class="button primary"
        :disabled="
          !xarAmount ||
          new Decimal(xarAmount || 0).equals(0) ||
          new Decimal(xarAmount || 0).greaterThan(xarAvailable || 0) ||
          isDeadlineOver
        "
        @click.stop="handleDeposit"
      >
        Deposit
      </button>
    </form>
  </div>
</template>

<style lang="css" scoped>
.card {
  padding: 2rem;
}

label {
  font-size: var(--fs-14);
  line-height: 1.5;
}

.max-button {
  color: var(--color-blue);
  font-size: var(--fs-14);
  font-weight: 600;
}

form .button.primary {
  width: 100%;
  height: 3rem;
  margin-top: 1.5rem;
}

input {
  font-size: var(--fs-24);
  font-weight: 500;
  line-height: 1;
  min-width: 2rem;
  max-width: 20rem;
}

.token {
  font-weight: 500;
  font-size: var(--fs-16);
  line-height: 1.25;
}

.separator {
  height: 2.25rem;
  width: 2px;
  background-color: #39444a29;
  border-radius: 0.5rem;
}

.token-img {
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
}

.alert-chip {
  padding: 0.75rem;
  font-size: var(--fs-12);
  font-weight: 500;
  gap: 0.75rem;
}

.text-input.disabled {
  opacity: 0.5;
}
</style>
