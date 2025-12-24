class WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;

  async request(): Promise<boolean> {
    // Check if Wake Lock API is supported
    if (!("wakeLock" in navigator)) {
      console.warn("Wake Lock API is not supported in this browser");
      return false;
    }

    try {
      // Request wake lock
      this.wakeLock = await navigator.wakeLock!.request("screen");
      
      // Handle wake lock release (e.g., when user switches tabs)
      this.wakeLock.addEventListener("release", () => {
        console.log("Wake Lock was released");
      });

      return true;
    } catch (error) {
      console.error("Error requesting wake lock:", error);
      return false;
    }
  }

  async release(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
      } catch (error) {
        console.error("Error releasing wake lock:", error);
      }
    }
  }

  isActive(): boolean {
    return this.wakeLock !== null;
  }
}

export const wakeLockManager = new WakeLockManager();

