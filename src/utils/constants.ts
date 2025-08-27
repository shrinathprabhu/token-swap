import dayjs from 'dayjs'

export const stakeContract = '0xCD492FeF558B9BF30B81e3706632b5394EF0e515'
export const xarContract = '0x5027Fc44a7Ba114B8f494B1e4970900C6652FEDF'
export const availContract = '0xEeB4d8400AEefafC1B2953e0094134A887C76Bd8'

export const XARToAvailDivisor = 4

export const explorerUrl = 'https://etherscan.io/'

export function getTransactionUrl(txHash: string) {
  return new URL(`/tx/${txHash}`, explorerUrl).href
}

export const deadlineTime = dayjs('2026-02-08T00:00:00.000Z')
export const unlock1Time = dayjs('2026-02-28T00:00:00.000Z')
export const unlock2Time = dayjs('2026-08-28T00:00:00.000Z')
