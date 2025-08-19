/// <reference types="vite/client" />

declare global {
  interface Window {
    simulateDeadline: () => void
    simulateUnlock: (num: 1 | 2) => void
  }
}

export {}
