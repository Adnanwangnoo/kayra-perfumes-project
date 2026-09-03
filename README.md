# Kayra Digital Bloom

KAYRA PERFUMES — PREMIUM 3D E-COMMERCE WEBSITE
ROLE
You are a world-class:
* Creative Director
* Luxury Brand Designer
* Senior UI/UX Designer
* 3D Web Experience Designer
* Senior Full-Stack JavaScript Engineer
* E-commerce Architect
* Performance Engineer
You are building the official website for Kayra Perfumes, a premium perfume brand inspired by Kashmir.
The final website must NOT feel like a generic Shopify template, AI-generated landing page, or ordinary perfume e-commerce website.
It should feel like a luxury digital fragrance experience.
Think of the quality level of premium brands such as Dior, Byredo, Le Labo, Tom Ford, Aesop and high-end fashion/luxury websites — but DO NOT copy their designs.
Create an original visual identity specifically for Kayra.
⸻
1. CORE BRAND DIRECTION
Kayra should communicate:
* Luxury
* Kashmir
* Sophistication
* Elegance
* Mystery
* Nature
* Premium craftsmanship
* Modern Indian luxury
* Minimalism
* Sensory experience
The website should make the visitor feel that they are entering the world of Kayra rather than simply visiting an online store.
Avoid:
* Generic gradients
* Excessive glassmorphism
* Cheap-looking 3D effects
* Excessive animations
* Template-like cards everywhere
* Huge amounts of text
* Cluttered interfaces
* Unnecessary UI elements
* Random decorative elements
The design should be minimal, cinematic and expensive-looking.
⸻
2. IMPORTANT — USE MY EXISTING ASSETS
I already have Kayra:
* Product photographs
* Product videos
* Product bottle images
* Brand assets
* Existing website/design concepts
* Product information
DO NOT replace my real product photography with random generated images.
Use my actual assets wherever available.
If an asset is missing, create the architecture so I can easily replace it later.
Do not invent fake products, fake product photographs, fake reviews or fake brand claims.
Use placeholder content only where absolutely necessary and clearly structure it so it can later be replaced through the CMS.
⸻
3. HOMEPAGE EXPERIENCE
The homepage should NOT immediately look like a conventional e-commerce store.
Create a cinematic opening experience.
HERO SECTION
On mobile:
At the top, prominently display:
KAYRA
Then introduce the hero fragrance/product.
For example:
BLOOM
with:
* Product bottle
* Short fragrance description
* Fragrance identity
* Primary CTA
* Secondary CTA
The product bottle should feel like the hero object.
The background can use subtle:
* Kashmir-inspired atmosphere
* Mist
* Soft shadows
* Premium textures
* Subtle light movement
* Elegant environmental imagery
The product should feel integrated into the scene rather than simply placed inside a card.
⸻
4. HERO ANIMATION
Create subtle cinematic animation.
Possible sequence:
1. Kayra logo appears.
2. Background slowly fades in.
3. Product bottle enters/reveals itself.
4. Lighting subtly changes.
5. Product name appears.
6. Description fades in.
7. CTA appears.
Do NOT make this a flashy animation.
The animation should feel:
* Slow
* Premium
* Cinematic
* Smooth
Prioritize performance on mobile devices.
⸻
5. PRODUCT SLIDER
Create a premium horizontal product slider.
Each slide represents a signature Kayra fragrance.
Example:
BLOOM
Then other actual Kayra fragrances from my product catalogue.
When the user changes the slide:
* Product bottle transitions smoothly.
* Background changes subtly.
* Product name changes.
* Description changes.
* Fragrance notes update.
* CTA updates.
The transition should feel like changing scenes in a luxury fragrance film.
Do not simply use a basic carousel.
⸻
6. SCROLL EXPERIENCE
The homepage should tell a story as the user scrolls.
Structure the experience approximately as:
HERO
↓
SIGNATURE FRAGRANCE
↓
FRAGRANCE STORY
↓
KAYRA / KASHMIR STORY
↓
FRAGRANCE NOTES
↓
COLLECTION
↓
BRAND EXPERIENCE
↓
CTA
↓
FOOTER
The exact structure can be improved if you have a better UX solution, but maintain the overall storytelling approach.
⸻
7. “BORN IN KASHMIR” SECTION
Create a strong brand storytelling section.
Kayra is inspired by Kashmir.
Use this concept carefully.
Possible visual direction:
* Mountains
* Mist
* Snow
* Forest
* Walnut wood
* Kashmir architecture
* Natural textures
* Soft atmospheric photography
Do NOT turn this into a stereotypical tourism website.
The Kashmir connection should feel:
* Elegant
* Subtle
* Authentic
* Premium
The section should communicate the origin and inspiration of Kayra without overwhelming the visitor with text.
⸻
8. FRAGRANCE NOTES EXPERIENCE
Create an interactive fragrance notes section.
For every perfume, structure:
TOP NOTES
HEART NOTES
BASE NOTES
When the user interacts with the fragrance:
* Notes should visually appear.
* Bottle or fragrance visual can subtly react.
* Use elegant transitions.
* Keep typography premium.
If suitable, create subtle 3D or particle effects representing the fragrance.
Do not use excessive particles.
⸻
9. PRODUCT COLLECTION
Create a premium collection section.
Every product should have:
* Product image
* Product name
* Short description
* Price
* Size
* CTA
But do NOT make the cards look like generic e-commerce cards.
Use editorial/luxury product presentation.
On desktop:
* Large visual cards
* Generous whitespace
* Subtle hover interactions
On mobile:
* Smooth vertical/horizontal browsing
* Large product imagery
* Easy touch interaction
⸻
10. PRODUCT DETAIL PAGE
Every perfume needs a dedicated product page.
Include:
* Large product photography
* Product name
* Price
* Size selector if applicable
* Description
* Fragrance notes
* Top / Heart / Base notes
* Longevity
* Projection
* Recommended occasion
* Recommended season
* Ingredients/information where applicable
* Product story
* Add to Cart
* Buy Now
If I provide 360-degree product assets, implement a 360-degree viewer.
If I don’t provide 360-degree assets, do NOT fake a 360-degree view.
⸻
11. PRODUCT IMAGE INTERACTIONS
Use subtle interactions such as:
* Slow zoom
* Parallax
* Light movement
* Bottle rotation if actual 3D/sequence assets are available
* Mouse movement interaction on desktop
* Touch interaction on mobile where appropriate
The product must remain the focus.
⸻
12. SHOPPING EXPERIENCE
The website must function as a real e-commerce store.
Implement:
* Product catalogue
* Product detail pages
* Cart
* Add to cart
* Remove from cart
* Quantity updates
* Checkout
* Order summary
* Customer information
* Shipping information
* Payment integration architecture
* Order confirmation
The shopping experience should be extremely simple.
A visitor should be able to go:
PRODUCT → ADD TO CART → CHECKOUT → PAYMENT
with minimal friction.
⸻
13. CART UI
Create a premium cart experience.
Prefer a smooth slide-in cart/drawer rather than forcing the user to navigate away immediately.
The cart should display:
* Product
* Quantity
* Price
* Subtotal
* Shipping
* Total
* Checkout CTA
Include a clear “Continue Shopping” action.
⸻
14. PAYMENT ARCHITECTURE
Build the payment layer so that it is modular.
Do NOT hard-code the entire application around a single payment provider.
Create a payment service abstraction so a payment provider can be changed later.
The system should be ready for:
* Razorpay
* Other payment providers if required later
Payment secrets/API keys MUST NEVER be exposed on the frontend.
Use server-side payment verification.
Never trust a frontend “payment successful” response.
Verify payments using the payment provider’s server-side APIs/webhooks.
Implement:
* Order creation
* Payment order creation
* Payment verification
* Webhook handling
* Failed payment handling
* Successful payment handling
* Duplicate webhook protection
* Order status updates
⸻
15. CMS / ADMIN DASHBOARD
Create the architecture for a secure admin dashboard.
The admin should eventually be able to manage:
Products
* Name
* Description
* Price
* Images
* Videos
* Size
* Stock
* Fragrance notes
* Category
* Featured status
Orders
* Order ID
* Customer
* Products
* Amount
* Payment status
* Order status
* Shipping status
Content
* Hero content
* Brand story
* Collection
* Promotional banners
* Featured products
The website should not require code changes for normal product/content updates.
⸻
16. AUTHENTICATION & SECURITY
Implement secure architecture.
Requirements:
* Secure admin authentication
* Password hashing
* Session/token security
* Role-based access
* Input validation
* API validation
* Rate limiting
* Secure headers
* CORS configuration
* Environment variables
* Server-side secrets
* Protection against common injection attacks
* Protection against unauthorized admin access
Never expose:
* API keys
* Database credentials
* Payment secrets
* Email credentials
* WhatsApp credentials
in frontend code.
Use .env variables.
⸻
17. EMAIL AUTOMATION — ARCHITECTURE ONLY FOR NOW
I want the website to eventually support email automation.
DO NOT fully implement external email automation unless I explicitly ask you to.
However, design the architecture so it can later support:
Visitor / Marketing Emails
Potential flows:
* Welcome email
* Thank-you-for-visiting flow
* Newsletter signup confirmation
* New collection announcement
* Promotional campaigns
E-commerce Emails
* Order confirmation
* Payment confirmation
* Order shipped
* Order delivered
* Refund confirmation
* Abandoned cart reminder
Create clean event hooks in the backend so these can later trigger an email service.
Important:
Do NOT automatically send an email to every anonymous website visitor.
A website cannot legitimately know someone’s email merely because they visited.
Email automation should require the visitor to voluntarily provide their email address or otherwise consent.
⸻
18. WHATSAPP AUTOMATION — ARCHITECTURE ONLY FOR NOW
I also want future WhatsApp automation.
DO NOT fully implement it yet.
Prepare the backend architecture for future integration with an official WhatsApp Business API/provider.
Potential future flows:
* Order confirmation
* Payment confirmation
* Shipping notification
* Delivery notification
* Customer support
* Abandoned cart reminders
* Promotional messages where the user has opted in
IMPORTANT:
Do not send WhatsApp messages to users merely because they visited the website.
WhatsApp automation must be based on appropriate user opt-in and applicable messaging rules.
Create the backend/event architecture so WhatsApp can be connected later without rebuilding the website.
⸻
19. ANALYTICS
Prepare the architecture for analytics.
Track events such as:
* Page view
* Product view
* Product interaction
* Add to cart
* Remove from cart
* Begin checkout
* Payment initiated
* Payment completed
* Search
* Newsletter signup
Do not collect unnecessary personal data.
Structure analytics so the provider can be changed later.
⸻
20. SEARCH
Create a fast product search.
Search should support:
* Product name
* Collection
* Fragrance
* Notes
* Relevant keywords
Make search especially good on mobile.
⸻
21. MOBILE-FIRST DESIGN
This is extremely important.
A large percentage of Kayra visitors may come from mobile.
The website must be designed mobile-first.
Test:
* iPhone-sized screens
* Android-sized screens
* Small screens
* Large phones
* Tablets
* Desktop
* Large desktop
Touch interactions must feel natural.
Do not simply shrink the desktop website for mobile.
Create a genuinely designed mobile experience.
⸻
22. 3D / ANIMATION TECHNOLOGY
Use modern web animation technologies where appropriate.
Potential technologies:
* GSAP
* Three.js
* React Three Fiber
* Framer Motion
* CSS animations
* WebGL
BUT:
Do not use 3D just because it is technically possible.
Every animation must have a purpose.
Performance is more important than visual complexity.
If a 3D effect causes lag on mobile, provide a lighter fallback.
⸻
23. PERFORMANCE
The previous problem I experienced with 3D websites was excessive lag.
Do NOT repeat that.
Optimize aggressively.
Implement:
* Lazy loading
* Responsive images
* WebP/AVIF where appropriate
* Image compression
* Code splitting
* Dynamic imports
* Animation throttling
* GPU-friendly transforms
* Reduced motion support
* Mobile fallback animations
* Efficient 3D rendering
* Avoid unnecessary re-renders
Do not load huge 3D libraries/components on every page if they are not needed.
The initial page load should remain fast.
⸻
24. REDUCED MOTION
Respect:
prefers-reduced-motion
Users who disable motion should receive a clean, elegant static experience.
⸻
25. SEO
Implement proper technical SEO.
Include:
* Semantic HTML
* Metadata
* Title tags
* Meta descriptions
* Open Graph
* Twitter/X cards
* Canonical URLs
* Sitemap
* Robots.txt
* Structured data where appropriate
* Product schema
* Organization schema
* Breadcrumb schema where appropriate
Product pages should be search-engine friendly.
⸻
26. ACCESSIBILITY
Follow accessibility best practices.
Include:
* Keyboard navigation
* Proper contrast
* Alt text
* Semantic HTML
* Focus states
* Accessible buttons
* Accessible forms
* Screen-reader-friendly labels
Do not sacrifice accessibility for visual effects.
⸻
27. TECHNOLOGY
Use a modern production-ready stack.
Prefer:
Frontend:
* React
* Vite or Next.js if appropriate
* TypeScript
* Modern CSS
* GSAP / Framer Motion where appropriate
* Three.js only where justified
Backend:
* Node.js
* Express or a suitable backend architecture
Database:
Use a scalable database architecture such as PostgreSQL/Supabase if appropriate.
Structure the project cleanly.
⸻
28. CODE QUALITY
Do not create one massive component.
Use a modular architecture.
For example:
components/
pages/
layouts/
hooks/
services/
lib/
utils/
api/
admin/
styles/
assets/
Keep business logic separate from UI.
Payment logic must remain server-side.
Email/WhatsApp integrations must remain server-side.
⸻
29. ENVIRONMENT VARIABLES
Prepare .env.example.
Potential variables may include:
DATABASE_URL
PAYMENT_PROVIDER_KEY
PAYMENT_PROVIDER_SECRET
EMAIL_API_KEY
WHATSAPP_API_KEY
ADMIN_SECRET
ANALYTICS_ID
Do not put real credentials in the code.
⸻
30. ERROR HANDLING
Implement graceful error states.
Examples:
* Product unavailable
* Payment failed
* Network error
* Checkout error
* Invalid coupon
* Out-of-stock product
* Server error
Never show raw backend errors to customers.
⸻
31. LOADING EXPERIENCE
Create elegant loading states.
Do not show generic browser-like loading screens.
Use subtle Kayra branding.
For example:
KAYRA
with a minimal animated reveal.
Keep the loading time short.
Do not create a loading animation that makes the website feel slower than it actually is.
⸻
32. MICRO-INTERACTIONS
Use premium micro-interactions:
* Button hover
* Product image hover
* Add-to-cart animation
* Cart updates
* Page transitions
* Scroll reveals
* Cursor interaction on desktop if appropriate
Keep them subtle.
⸻
33. TYPOGRAPHY
Use sophisticated typography.
The typography should communicate luxury.
Use:
* Elegant serif typography for selected brand moments
* Clean modern sans-serif for UI and product information
Maintain excellent readability.
Do not overuse decorative fonts.
⸻
34. COLOR & MATERIAL DIRECTION
Explore a palette inspired by:
* Ivory
* Warm white
* Pearl
* Soft beige
* Walnut
* Charcoal
* Matte black
* Very subtle gold/metallic accents if appropriate
Avoid excessive gold.
The website should feel premium, not flashy.
⸻
35. FOOTER
Create a sophisticated footer containing:
Kayra logo
Navigation:
* Home
* Shop
* Collections
* About
* Contact
Customer:
* Shipping
* Returns
* Privacy
* Terms
* FAQ
Social:
* Instagram
* Other official social channels
Newsletter signup
Contact information
The footer should feel like part of the brand experience.
⸻
36. IMPORTANT USER EXPERIENCE PRINCIPLE
DO NOT force users through unnecessary animations before they can shop.
The website should be beautiful but also extremely usable.
A visitor should always understand:
Where am I?
What product am I looking at?
What does it smell like?
How much does it cost?
How do I buy it?
within seconds.
⸻
37. DESIGN PRIORITY
Follow this priority order:
1. Brand identity
2. Product presentation
3. User experience
4. Conversion
5. Performance
6. Accessibility
7. SEO
8. Advanced animation
Never sacrifice the first five for unnecessary visual effects.
⸻
38. DO NOT OVERENGINEER
This is extremely important.
Do not build complicated infrastructure simply because it sounds impressive.
Build a production-ready system that is:
* Maintainable
* Scalable
* Secure
* Fast
* Easy to update
If a simpler technical solution achieves the same visual/functional result, use the simpler solution.
⸻
39. CURRENT TASK
First inspect the existing project and understand:
* Current architecture
* Existing components
* Existing styling
* Existing assets
* Existing product data
* Existing routes
* Existing dependencies
* Existing backend
* Existing API structure
DO NOT immediately delete the existing implementation.
Reuse good existing code where appropriate.
Do not destroy working functionality without a reason.
⸻
40. IMPORTANT — DO NOT JUST GIVE ME A MOCKUP
I do NOT want only a visual concept.
I want an actual working website implementation.
Build the actual:
* UI
* Navigation
* Pages
* Components
* Animations
* Product structure
* Cart architecture
* Backend architecture
* API structure
* CMS-ready structure
* Payment-ready architecture
* Email-ready architecture
* WhatsApp-ready architecture
where appropriate.
⸻
41. DEVELOPMENT PROCESS
Work in phases.
PHASE 1
Analyze the existing project.
Tell me:
* What already exists
* What should be kept
* What should be redesigned
* What needs to be added
* Any architectural problems
PHASE 2
Implement the new Kayra visual system.
PHASE 3
Implement homepage storytelling and animations.
PHASE 4
Implement product/collection experience.
PHASE 5
Implement cart and checkout architecture.
PHASE 6
Implement backend/API architecture.
PHASE 7
Prepare payment integration architecture.
PHASE 8
Prepare email/WhatsApp automation architecture.
PHASE 9
Security hardening.
PHASE 10
Performance optimization.
PHASE 11
SEO/accessibility.
PHASE 12
Final testing.
⸻
42. DO NOT ASK ME TO APPROVE EVERY SMALL CHANGE
Make sensible design decisions yourself.
Only ask me questions when you genuinely need information that cannot reasonably be inferred from the project/assets.
Otherwise proceed.
⸻
43. FINAL QUALITY BAR
Before considering the project complete, test:
* Mobile responsiveness
* Desktop responsiveness
* Navigation
* Product browsing
* Product details
* Cart
* Checkout flow
* Error states
* Loading states
* Animations
* Performance
* Accessibility
* SEO
* Security
* API failures
* Payment failure handling
Remove:
* Console errors
* Broken links
* Layout shifts
* Unnecessary animations
* Dead code
* Unused dependencies
* Broken mobile interactions
⸻
FINAL CREATIVE DIRECTION
The final result should feel like:
“A luxury fragrance film that happens to be an e-commerce website.”
Not:
“An e-commerce website with animations.”
The product must remain the hero.
The Kayra brand must remain the identity.
Kashmir must remain the inspiration.
The shopping experience must remain effortless.
Build something visually unforgettable but technically disciplined.
Start by inspecting my existing project before making major changes.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kayra-digital-essence.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c0b6cf82-377a-4c03-bede-12cc5dbe1aba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
#   k a y r a - p e r f u m e s - p r o j e c t  
 