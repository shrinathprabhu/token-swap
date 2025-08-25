import dayjs from 'dayjs'

export const stakeContract = '0x675a469dad39d739f15de530d36af7e30ad905ad'
export const xarContract = '0xac03CEb03C3AE0dA5aA13c3490Bf4C1B2121b2b9'
export const availContract = '0x7D0885d9b219D507195F2b63Fd95096e14346f16'

export const XARToAvailDivisor = 4

export const explorerUrl = 'https://sepolia.etherscan.io/'

export function getTransactionUrl(txHash: string) {
  return new URL(`/tx/${txHash}`, explorerUrl).href
}

export const deadlineTime = dayjs('2025-08-25T20:00:00.000Z')
export const unlock1Time = dayjs('2025-08-26T06:00:00.000Z')
export const unlock2Time = dayjs('2025-08-26T10:00:00.000Z')
