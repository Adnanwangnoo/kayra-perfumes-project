/**
 * Canonical public origin. Override per deployment with VITE_SITE_URL
 * (e.g. https://kayraperfumes.in) so canonical/OG URLs stay absolute.
 */
export const SITE_URL = (
  import.meta.env["VITE_SITE_URL"] || "https://kayra-digital-essence.lovable.app"
).replace(/\/$/, "");

export const absoluteUrl = (path: string): string =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
