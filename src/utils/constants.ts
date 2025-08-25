export const stakeContract = '0xC6CA21A913C7c3D6237Dcd69509B6D7Eb88596E9'
export const xarContract = '0xac03CEb03C3AE0dA5aA13c3490Bf4C1B2121b2b9'
export const availContract = '0x7D0885d9b219D507195F2b63Fd95096e14346f16'

export const XARToAvailDivisor = 4

export const explorerUrl = 'https://sepolia.etherscan.io/'

export function getTransactionUrl(txHash: string) {
  return new URL(`/tx/${txHash}`, explorerUrl).href
}
