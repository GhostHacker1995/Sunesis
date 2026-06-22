# Sunesis Rebuild — Summary

Full ground-up rebuild of the old Bootstrap/Owl template into a hand-authored static
HTML/CSS/JS site. Branch: `rebuild/static-site`.

## What changed (structure / visual / copy)

- **Stack:** removed Bootstrap, Owl Carousel, WOW.js, Lity, jQuery, Popper, Font Awesome,
  Flaticon. Now one CSS file + one small vanilla JS file, inline SVG icons, Inter font.
- **Visual language:** adopted the client's Glowdent/Onix reference — floating white pill
  navbar, full-bleed photo hero with overlay + floating cards, big centered headings, rounded
  cards, pill buttons with arrows, accent-colored testimonial cards with star ratings, and a
  dark footer with three contact cards + a "Send Us a Message" input + link columns. Kept the
  **Sunesis teal `#025754` / green `#50BB7A`** brand throughout (no Glowdent blue). No invented
  stats (used qualitative cards instead of "98%"/"115k+").
- **URLs:** clean extensionless routes via `vercel.json` (cleanUrls) + `netlify.toml` /
  `_redirects`; local preview via `serve.py`.
- **Forms:** contact, booking, footer message, and First Aid "Notify Me" all compose a
  prefilled **WhatsApp** message (no backend) with an on-screen success state. Site-wide
  WhatsApp FAB + click-to-call.
- **Pages (10):** Home, About, Services overview, 5 service detail pages, Contact, Appointment.
  Copy taken verbatim from the master brief. "Fast Response Time" singular fix applied.
  Mental Health page omits rehab (phase note) and never uses the name "Epignosis". First Aid
  page includes the "Coming Soon: Training Resources" block with a notify form.
- **SEO:** unique title + meta description per page, `MedicalBusiness` JSON-LD on home,
  `sitemap.xml`, `robots.txt`, descriptive alt text, `font-display:swap`.

## Verified
- All 10 pages return 200; all internal links resolve (0 broken); no console errors.
- Hero + footer + testimonials confirmed on desktop and mobile (375px); nav drawer, scroll
  reveal, step highlight, and all WhatsApp forms work.
- Hero contrast: white on `#025754` ≈ 8.9:1 (passes WCAG AA/AAA).

## Outstanding before launch
See `IMAGE-MANIFEST.md` and the in-page `NEEDS CLIENT INPUT` / `NEEDS CLIENT VERIFICATION`
comments: client testimonials + star ratings, 3 team quotes, Dr. Gift & Dr. Joshua titles,
6 workbook titles + 4 course descriptions, partner logos + label, social URLs, real domain
for sitemap/robots, client image files, and image compression.

## Not yet done from the original plan
- Lighthouse before/after numbers (run in a real browser/CI before launch).
- Image compression (deferred per client).
