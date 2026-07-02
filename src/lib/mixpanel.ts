import mixpanel, { type OverridedMixpanel } from "mixpanel-browser";

/**
 * Analytics module — thin wrapper around mixpanel-browser.
 *
 * Reads the project token from `VITE_MIXPANEL_TOKEN` (see `.env`).
 * The whole module is a no-op when the token is missing so the app
 * continues to work without analytics configured.
 */

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;

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
    // Missing token: leave analytics disabled but do not throw.
    // eslint-disable-next-line no-console
    console.info("[mixpanel] VITE_MIXPANEL_TOKEN not set — analytics disabled.");
    return;
  }
  try {
    mixpanel.init(TOKEN, {
      track_pageview: true,
      persistence: "localStorage",
      debug: import.meta.env.DEV,
      ignore_dnt: true,
    });
    enabled = true;
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