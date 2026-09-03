# Kayra Perfumes — roadmap

## Done
- Brand identity, homepage cinematic experience, shop, PDP, cart, checkout
- Razorpay integration (order create, modal, server signature verification, webhooks)
- Email/WhatsApp order + shipment notifications
- Structured data (Organization, Product, ItemList, Breadcrumb)

## Done — production export / self-hosting
- [x] Local image assets under `public/images/` and updated references
- [x] `.env.example` covering every required variable
- [x] SEO: og:image + canonical per route, `robots.txt`, `/sitemap.xml`
- [x] Clean build verification for self-hosted / Vercel / Netlify deploys

## Pending (user action)
- Connect custom domain kayraperfumes.in (DNS records via the connect card)
- Add RAZORPAY_WEBHOOK_SECRET, EMAIL_API_KEY, WHATSAPP_* , ADMIN_SECRET
