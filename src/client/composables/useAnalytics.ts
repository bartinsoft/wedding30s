declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackPurchase(value: number, currency = 'EUR', transactionId?: string): void {
  trackEvent('purchase', {
    value,
    currency,
    transaction_id: transactionId,
  })
}
