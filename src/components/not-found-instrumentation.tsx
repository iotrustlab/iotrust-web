'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function NotFoundInstrumentation() {
  useEffect(() => {
    const pagePath = window.location.pathname;

    if (process.env.NODE_ENV !== 'production') return;

    const referrerHost = (() => {
      if (!document.referrer) return undefined;
      try {
        return new URL(document.referrer).hostname;
      } catch {
        return undefined;
      }
    })();

    const eventParams = {
      page_path: pagePath,
      referrer_host: referrerHost,
    };

    let attempts = 0;
    const emit = () => {
      attempts += 1;
      if (!window.gtag) return false;

      window.gtag('event', 'page_not_found', eventParams);
      return true;
    };

    if (emit()) return;

    const timer = window.setInterval(() => {
      if (emit() || attempts >= 8) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
