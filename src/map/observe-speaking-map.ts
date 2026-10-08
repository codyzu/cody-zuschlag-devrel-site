export function observeSpeakingMap() {
  const wrapper = document.querySelector<HTMLElement>('#speaking-map-wrapper');
  if (!wrapper) {
    return;
  }

  const load = async () => {
    try {
      const {initializeSpeakingMap} = await import('./speaking-map.ts');
      initializeSpeakingMap();
    } catch {
      // The prerendered city list and external link remain available on failure.
      const container = document.querySelector<HTMLElement>('#speaking-map');
      if (container) {
        container.hidden = true;
      }
    }
  };

  if (!('IntersectionObserver' in globalThis)) {
    void load();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.every((entry) => !entry.isIntersecting)) {
        return;
      }

      observer.disconnect();
      void load();
    },
    {rootMargin: '200px'},
  );
  observer.observe(wrapper);
}
