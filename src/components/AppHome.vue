<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Decimal from 'decimal.js'
import dayjs from 'dayjs'
import { useStateStore } from '@/stores/state'
import AppDeposit from './AppDeposit.vue'
import AppWithdraw from './AppWithdraw.vue'

const state = useStateStore()
const xarAmount = ref('0.00')
const xarDecimals = Decimal.pow(10, 18)
const xarAvailable = computed(() => new Decimal(state.xarBalance).div(xarDecimals).toFixed())
const inputXar = ref<HTMLInputElement | null>()
const inputAvail = ref<HTMLInputElement | null>()

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

const availAmount = computed(() => {
  if (!xarAmount.value) return '0'
  return Decimal.div(xarAmount.value, 4).toFixed()
})

const isDeadlineOver = computed(() => {
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

watch(xarAmount, handleXARChange, { immediate: true })
watch(availAmount, handleAVAILChange, { immediate: true })
</script>

<template>
  <div id="app-deposit" class="center-column">
    <AppDeposit v-if="!isDeadlineOver" />
    <AppWithdraw />
  </div>
</template>

<style lang="css" scoped>
.center-column {
  padding-block: 1.5rem;
}

.card {
  padding: 1.5rem;
}
</style>
