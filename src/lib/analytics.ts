/**
 * Provider-agnostic analytics facade.
 *
 * Components only ever call `track(event, payload)`. Swapping in GA4, Plausible,
 * Meta or a server-side collector means registering a different sink here — no
 * component changes. No personal data is collected by design.
 */

export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "product_interaction"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "payment_initiated"
  | "payment_completed"
  | "payment_failed"
  | "search"
  | "newsletter_signup"
  | "contact_submitted";


export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

type Sink = (event: AnalyticsEvent, payload: AnalyticsPayload) => void;

const sinks: Sink[] = [];

export const registerSink = (sink: Sink) => {
  sinks.push(sink);
  return () => {
    const i = sinks.indexOf(sink);
    if (i >= 0) sinks.splice(i, 1);
  };
};

export const track = (event: AnalyticsEvent, payload: AnalyticsPayload = {}) => {
  if (typeof window === "undefined") return;
  for (const sink of sinks) {
    try {
      sink(event, payload);
    } catch {
      /* analytics must never break the store */
    }
  }
};

/** Dev-only sink so events are observable before a provider is connected. */
if (typeof window !== "undefined" && import.meta.env.DEV) {
  registerSink((event, payload) => console.debug("[analytics]", event, payload));
}
