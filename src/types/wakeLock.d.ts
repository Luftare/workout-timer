interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: "screen";
  release(): Promise<void>;
  addEventListener(
    type: "release",
    listener: (this: WakeLockSentinel, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: "release",
    listener: (this: WakeLockSentinel, ev: Event) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface Navigator {
  wakeLock?: {
    request(type: "screen"): Promise<WakeLockSentinel>;
  };
}

