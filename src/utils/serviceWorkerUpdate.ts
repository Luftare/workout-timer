/**
 * Utility to check for service worker updates
 * Helps with iOS PWA update issues by forcing update checks
 */

export const checkForServiceWorkerUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          // Force update check
          registration.update();
        });
      })
      .catch((error) => {
        console.error('Service worker update check failed:', error);
      });
  }
};

/**
 * Check for updates when app becomes visible (e.g., user switches back to app)
 */
export const setupUpdateCheckOnVisibility = () => {
  if (typeof document === 'undefined') return;

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Check for updates when app becomes visible
      checkForServiceWorkerUpdate();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Also check on focus (for better iOS support)
  const handleFocus = () => {
    checkForServiceWorkerUpdate();
  };

  window.addEventListener('focus', handleFocus);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
  };
};

