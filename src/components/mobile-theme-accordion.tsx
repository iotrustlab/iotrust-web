'use client';

import { useEffect } from 'react';

export function MobileThemeAccordion() {
  useEffect(() => {
    const section = document.getElementById('research');
    if (!section) return;

    const onToggle = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement) || !target.open) return;
      if (!target.matches('[data-theme-accordion-item]')) return;
      if (!window.matchMedia('(max-width: 767px)').matches) return;

      section.querySelectorAll<HTMLDetailsElement>('[data-theme-accordion-item][open]').forEach((item) => {
        if (item !== target) item.open = false;
      });
    };

    section.addEventListener('toggle', onToggle, true);
    return () => section.removeEventListener('toggle', onToggle, true);
  }, []);

  return null;
}
