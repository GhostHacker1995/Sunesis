# Sunesis Medical Services — Website Rebuild Design Spec

Date: 2026-06-22
Status: Approved (design), pending implementation plan
Source of truth for copy: the client master prompt (this spec embeds the final copy per page so it stands alone).

---

## 1. Overview

Full ground-up rebuild of the Sunesis Medical Services site — a mobile/home healthcare
provider in Kampala, Uganda. The current site is a content-customized Bootstrap/Owl-carousel
template referencing many images that no longer exist. We are replacing it entirely with
hand-authored static HTML/CSS/JS.

Brand: CEO Dr. Joel Omoding. Line: "Wisdom in Care. Excellence in Service." Philosophy:
caring for **Body, Mind, and Environment**.

## 2. Resolved decisions

1. **Clean URLs:** flat `.html` files served extensionless via host config
   (Vercel `cleanUrls: true` + Netlify pretty URLs / `_redirects`). Internal links are
   root-relative and extensionless (`/about-us`, `/services/mobile-care`). A tiny local
   preview server is included so clean URLs can be tested before deploy.
2. **Forms (no backend):** contact form, booking form, and the First Aid "Notify Me" capture
   compose a prefilled WhatsApp message from field values on submit (with click-to-call
   alongside). WhatsApp is the primary contact path site-wide. Clear on-screen confirmation.
3. **Missing imagery:** real `<img>` slots with descriptive filenames the client will supply
   (team headshots, 4 testimonial portraits, partner logos). A quiet brand-tinted CSS
   fallback prevents empty slots from looking broken. A drop-in manifest is delivered.

## 3. Tech & build approach

- Semantic HTML5, hand-authored. Remove Bootstrap, Owl Carousel, WOW.js, Lity, jQuery, Popper.
- One CSS file `assets/css/sunesis.css` on CSS custom-property design tokens + named component
  classes (split `tokens.css` only if it grows large).
- One small vanilla JS file `assets/js/sunesis.js`: mobile nav toggle, IntersectionObserver
  scroll-reveal, How-It-Works active-step highlight, form→WhatsApp composer, sticky WhatsApp
  button, scroll-to-top, dynamic year.
- Icons: inline SVG (no icon-font payload).
- Fonts: Inter via Google Fonts `&display=swap` (self-host is a fast-follow option). Two
  weights per section: 600/700 headings, 400 body, 500 UI labels/buttons.
- No build step; pure static.

## 4. Design system

- **Color tokens:**
  - `--teal: #025754` — primary: hero bg, header/footer, primary buttons, strong-presence sections.
  - `--green: #50BB7A` — accent ONLY: secondary CTA, hover states, icons, checkmarks, active
    How-It-Works step. Never a large background fill.
  - `--ink: #0E1B1A` — body text.
  - `--surface: #F7F9F8` — alternating section background.
  - `#FFFFFF` — white sections.
  - Hover/focus/disabled/link states are derived tints/shades of teal/green only. No new hues.
  - No pure black, no low-contrast white-on-grey anywhere.
- **Typography:** fluid `clamp()` scale; hero headline dominant (Stripe/Linear altitude);
  hierarchy by size more than weight (lighter premium headings).
- **Spacing:** single `--section-y` rhythm token; deliberate background alternation
  white → `--surface` → teal-dark down each page.
- **Components:** button (primary/ghost), card (minimal border OR soft shadow, not both),
  eyebrow label, section header, step node, testimonial card, team card, feature row,
  form controls with green focus ring, sticky WhatsApp FAB.
- **Accessibility:** WCAG AA contrast site-wide; visible focus states; reduced-motion respect
  for scroll-reveal.

## 5. File structure

```
/index.html                      -> /
/about-us.html                   -> /about-us
/services.html                   -> /services
/services/mobile-care.html       -> /services/mobile-care
/services/corporate-health.html  -> /services/corporate-health
/services/mental-health.html     -> /services/mental-health
/services/medical-travel.html    -> /services/medical-travel
/services/first-aid.html         -> /services/first-aid
/contact-us.html                 -> /contact-us
/appointment.html                -> /appointment
/assets/css/sunesis.css
/assets/js/sunesis.js
/assets/images/...               (existing + client slot files)
/vercel.json  /netlify.toml  /_redirects   (clean-URL config)
/sitemap.xml  /robots.txt
/serve.py (or equivalent)        (local clean-URL preview)
```

Header and footer markup are duplicated byte-identically per page (most robust for static;
no JS dependency for nav). Updates are a controlled find/replace.

## 6. Global elements (site-wide)

- **Top utility bar:** service area · email · phone · "Chat on WhatsApp" button.
  Social icons REMOVED until real profile URLs are supplied (no `#` dead links).
- **Sticky header:** logo (`assets/images/logos/logo-white-bg.png` for now), nav, primary
  "Book a Mobile Visit" button; mobile hamburger drawer.
- **Sticky WhatsApp FAB** bottom-right on every page → `https://wa.me/256758942379?text=Hi%2C%20I%27d%20like%20to%20book%20a%20mobile%20visit`.
- **Footer:** contact line (Kampala, Uganda | email | phone), link columns (About, Services,
  Book a Visit, Contact), "Powered by Grayhost Innovations (grayhost.dev)", dynamic year.
- **WhatsApp number:** `+256 758 942379` → `https://wa.me/256758942379`.

## 7. Page maps (final copy embedded)

### 7.1 Home (`/`)
1. **Hero** (teal bg, white text): eyebrow "Wisdom in Care. Excellence in Service.";
   H1 **"Care That Goes Beyond Hospital Walls"**; sub "Holistic, mobile, and people-centered
   healthcare delivered at your home, workplace, school, or wherever you are."; CTAs
   "Book a Mobile Visit" (primary) / "Request Corporate Services" (ghost); image `hero-section.jpg`.
2. **Professional Care at Your Doorstep** — eyebrow "Care Beyond Hospital Walls"; body
   "Doctor consultations, nursing care, lab services, and chronic disease management,
   delivered wherever you feel most comfortable."; CTAs "Explore Mobile Care" / "Schedule a Visit".
3. **Care for the Whole Person** — eyebrow "Body. Mind. Environment."; body "We go beyond
   treatment. Our holistic approach supports your physical health, mental well-being, and the
   environment you heal in."; CTAs "Mental Health Support" / "Learn About Sunesis".
4. **About Sunesis (single homepage version)** — H "Wisdom in Care. Excellence in Service.";
   body (Greek-wisdom narrative, whole-person); quote "Healthcare should feel human,
   compassionate, and accessible. Sometimes the most meaningful care happens where people feel
   safest, in their homes, workplaces, and communities."; signature Dr. Joel Omoding, CEO;
   CTA "Learn More About Us". **At a Glance** sidebar: Certified Professionals · **Fast Response
   Time** (singular fix) · Confidential & Patient-Centered · Affordable Packages · Holistic
   Approach to Health.
5. **Our Services** — H "Comprehensive Mobile Healthcare"; subhead as spec; 5 cards (Mobile &
   On-Demand Care; Corporate & Institutional Services; Specialized & Mental Health; Medical
   Travel Services; First Aid Services & Training), each "Learn More" → its detail page;
   CTA "View Full Services".
6. **How It Works** — connected horizontal (desktop) / vertical (mobile) step flow with
   connecting line, SVG icon per step, scroll-reveal, active-step highlight. 4 steps
   (Book Online or Call Us; We Confirm and Dispatch a Professional; Receive Care at Your
   Location; Follow-Up and Ongoing Support). CTA "Book Your Mobile Visit Today".
7. **Why Choose Sunesis** — H "Wisdom in Care. Excellence in Service."; 4 features
   (Convenience; Comprehensive Care; Personalized Approach; Professional & Confidential).
8. **Testimonials** — H "What Our Clients and Team Say". 4 client testimonials (Sarah Nakamya;
   David Okello; Grace A.; James Wasswa) — FLAG NEEDS CLIENT VERIFICATION. 3 team-quote cards —
   PLACEHOLDER, not published as real; flagged NEEDS CLIENT INPUT.
9. **Partners / Accreditation** — labeled heading (Trusted By / Our Partners / Accredited By —
   NEEDS CLIENT INPUT which); image slots for client-supplied logos.
10. **Footer.**

### 7.2 About Us (`/about-us`)
- At-a-Glance band: Mobile & Home-Based Care · Serving Kampala & Beyond · Individuals,
  Families & Organizations · Holistic, Whole-Person Care.
- Who We Are (H "Wisdom in Care. Excellence in Service.", full body, signature Dr. Joel Omoding).
- Our Purpose: Mission + Vision (full copy).
- Our Approach: Body / Mind / Environment (full copy).
- Our Values: Compassion / Integrity / Accessibility / Confidentiality (full copy).
- Meet Our Medical Team (H "The People Behind Your Care"): grid of Dr. Gift [title NEEDS INPUT],
  Dr. Eve (Physician), Dr. Joshua [title NEEDS INPUT], Dr. Rachel (Emergency Physician).
  Headshot slots, no invented titles.
- Closing CTA band: H "Healthcare That Comes to You"; CTAs "Book a Mobile Visit" / "Contact Us".

### 7.3 Services overview (`/services`)
- H "Comprehensive Mobile Healthcare"; intro per spec; 5 cards (homepage teaser copy) linking
  to detail pages.

### 7.4 Service detail pages
Each: hero (H + intro), What's Included list, Who It's For, CTA. Service-page image from the
existing photo set (mapping in manifest).
- **Mobile & On-Demand Care** (`/services/mobile-care`): H "Healthcare Without the Waiting
  Room"; full What's Included (6 items); CTA "Schedule a Mobile Visit". Image `nurse-and-doctor.jpg`.
- **Corporate & Institutional Services** (`/services/corporate-health`): H "Wellness Built Into
  the Workplace and the Classroom"; 5 items; CTA "Request Corporate Services".
- **Specialized & Mental Health** (`/services/mental-health`): H "Confidential Care for the
  Mind"; 3 items (counseling; diagnosis/therapy; anxiety/depression/stress). **OMIT rehab** per
  phase note; do not use the name "Epignosis" anywhere. CTA "Book a Confidential Session".
  Image `mental-health.jpg` / `counselling.jpg`.
- **Medical Travel Services** (`/services/medical-travel`): H "Travel Documentation, Handled
  Properly"; 4 items; CTA "Request Travel Documentation". Image `medical-travel.jpg`.
- **First Aid Services & Training** (`/services/first-aid`): H "First Aid That's Ready Before
  You Need It"; full What's Included (7 items); Who It's For; Why It Matters; CTAs "Book First
  Aid Training" / "Request Event Coverage". Images `first-aid-training.jpg`, `first-aid-service.jpg`,
  `bandaging.jpg`, `first-aid-medicines.jpg`. **Coming Soon: Training Resources** subsection —
  intro line, "Notify Me When This Launches" capture (→ WhatsApp), cards with "Coming Soon"
  badge: 6 workbooks [titles TBD — NEEDS INPUT], 4 courses (First Aid; BLS; ACLS; CABS) with
  one-line descriptions [NEEDS INPUT]. No broken links / no 404 placeholders.

### 7.5 Contact (`/contact-us`)
- H "Get in Touch"; intro. Details: phone +256 758 942379, email
  sunesismedicalservices@gmail.com, Service Area Kampala & surrounding areas. Service-area
  Google Map embed (not a pin-drop address). Prominent click-to-call + WhatsApp near form.
  Form: Name, Phone, Email, Service Interested In (dropdown of 5 services), Message → composes
  WhatsApp message; on-screen confirmation.

### 7.6 Appointment / Booking (`/appointment`)
- H "Book Your Mobile Visit"; intro. Form: full name, phone, email, service requested
  (dropdown of 5 + First Aid Training/Coverage), preferred date & time, location/address,
  notes (symptoms/special requirements/group size) → composes WhatsApp message; clear
  on-screen confirmation that the request was sent.

## 8. SEO / technical

- Unique `<title>` + meta description per page (no Home/About duplication).
- `MedicalBusiness` JSON-LD: `areaServed` = Kampala and surrounding areas; 5 services under
  `availableService`.
- Long-tail keywords woven naturally: "home doctor visit Kampala", "mobile nurse Uganda",
  "first aid training Kampala", "corporate health screening Uganda", "CPR training Uganda".
- Descriptive alt text per real filename and depicted content (no generic alt).
- `sitemap.xml` + `robots.txt`.
- `font-display: swap`; compress oversized images (current 1–3 MB photos must be reduced).
- WCAG AA contrast verified site-wide. Lighthouse before/after reported.

## 9. Image manifest (client to supply)

A delivered checklist of exact paths + recommended dimensions for: 4 team headshots, 4
testimonial portraits, partner/accreditation logos. Plus a mapping of existing photos to
service pages. Empty slots get a brand-tinted CSS fallback meanwhile.

## 10. Flagged for client (surfaced as in-page HTML comments + in deliverable notes; not invented)

- Client testimonials — NEEDS CLIENT VERIFICATION.
- 3 team-quote placeholders — NEEDS CLIENT INPUT.
- Dr. Gift & Dr. Joshua titles/specialties — NEEDS CLIENT INPUT.
- First Aid workbook titles (6) + course one-liners (4) — NEEDS CLIENT INPUT.
- Partner-row label (Trusted By / Partners / Accredited By) — NEEDS CLIENT INPUT.
- Social profile URLs — supply to re-enable icons, else stay removed.

## 11. Acceptance criteria

- All 10 pages built, extensionless internal links, host config present, local preview works.
- No references to nonexistent template assets; no `#` dead links; no broken layouts where
  client images are pending (fallback shows).
- Brand palette + Inter applied consistently; hero passes contrast.
- WhatsApp FAB + form→WhatsApp working; click-to-call working.
- SEO artifacts present; schema validates; Lighthouse reported.
- Every flagged item present in-page as a comment and listed in the final deliverable summary.
- Deliverable summary states, per section: what changed structurally, visually, and in copy.
