declare global {
  interface Window {
    bridge?: {
      startWorker(specifier: string): Promise<boolean>
      onWorkerIPC(specifier: string, listener: (data: Uint8Array) => void): () => void
      onWorkerExit(specifier: string, listener: (code: number) => void): () => void
      writeWorkerIPC(specifier: string, data: string): Promise<boolean>
      copyText(text: string): Promise<boolean>
    }
  }
}

export {}
