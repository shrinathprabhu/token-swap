import dayjs from 'dayjs'

export const stakeContract = '0xCD492FeF558B9BF30B81e3706632b5394EF0e515'
export const xarContract = '0xac03CEb03C3AE0dA5aA13c3490Bf4C1B2121b2b9'
export const availContract = '0x7D0885d9b219D507195F2b63Fd95096e14346f16'

export const XARToAvailDivisor = 4

export const explorerUrl = 'https://etherscan.io/'

export function getTransactionUrl(txHash: string) {
  return new URL(`/tx/${txHash}`, explorerUrl).href
}

export const deadlineTime = dayjs('2026-02-08T00:00:00.000Z')
export const unlock1Time = dayjs('2026-02-28T00:00:00.000Z')
export const unlock2Time = dayjs('2026-08-28T00:00:00.000Z')
