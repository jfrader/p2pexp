import { useState } from 'react'

const copyToClipboard = async (text: string): Promise<boolean> => {
  if (window.bridge?.copyText) {
    return window.bridge.copyText(text)
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const useClipboard = ({ leaveDelay = 2000 } = {}) => {
  const [isCopying, setCopying] = useState(false)

  const copy = async (text: string) => {
    if (!text || isCopying) return
    const ok = await copyToClipboard(text)
    if (!ok) return
    setCopying(true)
    setTimeout(() => setCopying(false), leaveDelay)
  }

  return { copy, isCopying }
}
