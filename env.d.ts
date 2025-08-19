/// <reference types="vite/client" />

declare global {
  interface Window {
    simulateDeadline: () => void
    simulateUnlock: (num: 1 | 2) => void
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_REOWN_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
