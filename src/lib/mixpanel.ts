import mixpanel, { type OverridedMixpanel } from "mixpanel-browser";

/**
 * Analytics module — thin wrapper around mixpanel-browser.
 *
 * Reads the project token from `VITE_MIXPANEL_TOKEN` (see `.env`).
 * When the token is missing the module becomes a safe no-op so the
 * app keeps working without analytics configured.
 */

// Mixpanel project tokens are publishable (safe to ship to the browser).
// The env var takes precedence; the fallback keeps analytics working on
// the deployed Lovable site even when the build env is not configured.
const TOKEN =
  (import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined) ||
  "15f816b99ab300d896d24d457ed51c4f";

let initialized = false;
let enabled = false;

function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "unknown";
}

function baseProperties() {
  return {
    browser: detectBrowser(),
    device_type: detectDevice(),
    timestamp: new Date().toISOString(),
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
  };
}

export function initMixpanel(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  initialized = true;
  if (!TOKEN) {
    // eslint-disable-next-line no-console
    console.warn("Mixpanel disabled: missing VITE_MIXPANEL_TOKEN");
    return;
  }
  try {
    mixpanel.init(TOKEN, {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
      autocapture: true,
      ignore_dnt: false,
    } as Parameters<typeof mixpanel.init>[1]);
    enabled = true;
    // eslint-disable-next-line no-console
    console.log("Mixpanel initialized successfully");
    try {
      mixpanel.track("App Loaded", baseProperties());
    } catch {
      /* noop */
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[mixpanel] initialization failed", error);
  }
}

export function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
): void {
  if (!enabled) return;
  try {
    mixpanel.track(eventName, { ...baseProperties(), ...properties });
  } catch {
    // Swallow analytics errors — never break the app.
  }
}

export function identifyUser(
  userId: string,
  userProperties: Record<string, unknown> = {},
): void {
  if (!enabled) return;
  try {
    mixpanel.identify(userId);
    if (Object.keys(userProperties).length) {
      mixpanel.people.set(userProperties);
      mixpanel.register(userProperties);
    }
  } catch {
    /* noop */
  }
}

export function resetUser(): void {
  if (!enabled) return;
  try {
    mixpanel.reset();
  } catch {
    /* noop */
  }
}

export function trackPageView(path: string, extra: Record<string, unknown> = {}): void {
  trackEvent("Page Viewed", { page: path, ...extra });
}

export function trackError(error: unknown, context: Record<string, unknown> = {}): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  trackEvent("Error Occurred", { error_message: message, stack, ...context });
}

export const mixpanelInstance: OverridedMixpanel = mixpanel;
export const isAnalyticsEnabled = (): boolean => enabled;

export default mixpanel;