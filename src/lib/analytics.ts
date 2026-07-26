declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(name: string, params?: Record<string, any>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', name, params);
    } catch (e) {
      console.error('GA4 trackEvent error:', e);
    }
  }
}

export function trackPageView(url: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'page_view', {
        page_location: url,
        page_title: document.title
      });
    } catch (e) {
      console.error('GA4 trackPageView error:', e);
    }
  }
}
