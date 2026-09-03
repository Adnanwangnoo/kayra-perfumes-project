import { createFileRoute } from "@tanstack/react-router";

import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const staticPaths = ["/", "/shop", "/about", "/contact"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        // Prefer the request origin when self-hosted behind a different domain.
        const origin = new URL(request.url).origin || SITE_URL;
        const urls = [...staticPaths, ...products.map((p) => `/fragrance/${p.slug}`)]
          .map(
            (path) =>
              `  <url><loc>${origin}${path}</loc><changefreq>weekly</changefreq></url>`,
          )
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          {
            headers: {
              "content-type": "application/xml; charset=utf-8",
              "cache-control": "public, max-age=3600",
            },
          },
        );
      },
    },
  },
});
