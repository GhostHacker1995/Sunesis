# Sunesis Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Sunesis Medical Services site as a hand-authored static HTML/CSS/JS site (10 pages) with a teal/green brand system, Inter type, clean extensionless URLs, WhatsApp-based forms, and full SEO.

**Architecture:** No framework, no build step. One design-token + component CSS file, one small vanilla JS file, byte-identical duplicated header/footer per page, inline SVG icons. Flat `.html` files served extensionless via host config (Vercel/Netlify) with a local preview server for testing.

**Tech Stack:** HTML5, CSS custom properties, vanilla JS (IntersectionObserver), Inter (Google Fonts, `display=swap`), Python stdlib local preview server. No jQuery/Bootstrap/Owl/WOW/Lity.

**Spec:** `docs/superpowers/specs/2026-06-22-sunesis-website-rebuild-design.md`

---

## File Structure

```
/index.html                        Home
/about-us.html                     About Us
/services.html                     Services overview
/services/mobile-care.html         Service: Mobile & On-Demand Care
/services/corporate-health.html    Service: Corporate & Institutional
/services/mental-health.html       Service: Specialized & Mental Health
/services/medical-travel.html      Service: Medical Travel
/services/first-aid.html           Service: First Aid + Coming Soon resources
/contact-us.html                   Contact
/appointment.html                  Booking
/assets/css/sunesis.css            All styles (tokens + components + layout)
/assets/js/sunesis.js              All behavior
/assets/images/...                 Existing photos + client slot files
/vercel.json /netlify.toml /_redirects   Clean-URL config
/robots.txt /sitemap.xml           SEO
/serve.py                          Local clean-URL preview server
/docs/IMAGE-MANIFEST.md            Client image drop-in checklist
```

Canonical chrome (head block, top bar, header/nav, footer, FAB, scroll-top) is defined once in Task 4 and pasted byte-identical into every page, with only `<title>`, meta description, JSON-LD, and the active-nav class differing per page.

---

## Conventions for verification

There is no unit-test runner. Each build task ends with a verification step using the preview tools:
1. `preview_start` (once) pointing at `serve.py`, or reload.
2. `preview_console_logs` → expect no errors.
3. `preview_snapshot` / `preview_screenshot` to confirm structure/visuals.
4. Link + contrast + Lighthouse checks in the final task.

Commit after every task.

---

### Task 1: Scaffold, clean out template, host config, preview server

**Files:**
- Delete: `index.html`, `about-us.html`, `services.html`, `contact-us.html` (old template pages — replaced)
- Delete: `assets/css/animate.css`, `assets/css/bootstrap.min.css`, `assets/css/lity.min.css`, `assets/css/owl.carousel.min.css`, `assets/css/owl.theme.default.css`, `assets/css/owl.video.play.html`, `assets/css/simple-calendar.css`, `assets/css/style.css`, `assets/css/responsive.css`
- Delete: `assets/js/bootstrap.min.js`, `assets/js/jquery-3.4.1.js`, `assets/js/jquery.counterup.min.js`, `assets/js/jquery.simple-calendar.min.js`, `assets/js/jquery.waypoints.min.js`, `assets/js/lity.min.js`, `assets/js/main.js`, `assets/js/owl.carousel.min.js`, `assets/js/popper.min.js`, `assets/js/wow.min.js`
- Delete: `assets/fonts/flaticon/`, `assets/fonts/fontawesome/` (replaced by inline SVG)
- Delete: stale image dirs referencing nonexistent template assets: `assets/images/header/`, `assets/images/features/`, `assets/images/testimonials/`, `assets/images/sponsors/`, `assets/images/doctors/`, `assets/images/blog/`, `assets/images/gallery/`, `assets/images/newsletters/`, `assets/images/single-services/`, `assets/images/logo/` (keep `assets/images/logos/`)
- Delete: `serve_clean.py` if present at root (replaced by `serve.py`); leave `.vscode/`
- Create: `vercel.json`, `netlify.toml`, `_redirects`, `robots.txt`, `serve.py`, `assets/css/sunesis.css` (empty), `assets/js/sunesis.js` (empty)

- [ ] **Step 1: Remove old template CSS/JS/fonts and stale image dirs**

```bash
cd "D:/Projects/SUNESIS/SUNESIS/SunesisWebsite"
git rm -r assets/fonts/flaticon assets/fonts/fontawesome
git rm assets/css/animate.css assets/css/bootstrap.min.css assets/css/lity.min.css assets/css/owl.carousel.min.css assets/css/owl.theme.default.css assets/css/owl.video.play.html assets/css/simple-calendar.css assets/css/style.css assets/css/responsive.css
git rm assets/js/bootstrap.min.js assets/js/jquery-3.4.1.js assets/js/jquery.counterup.min.js assets/js/jquery.simple-calendar.min.js assets/js/jquery.waypoints.min.js assets/js/lity.min.js assets/js/main.js assets/js/owl.carousel.min.js assets/js/popper.min.js assets/js/wow.min.js
git rm -r "assets/images/header" "assets/images/features" "assets/images/testimonials" "assets/images/sponsors" "assets/images/doctors" "assets/images/blog" "assets/images/gallery" "assets/images/newsletters" "assets/images/single-services" "assets/images/logo"
```
Note: keep `assets/images/about/` photos for now (may map to About page); keep all root thematic photos and `assets/images/logos/`.

- [ ] **Step 2: Create `vercel.json`**

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

- [ ] **Step 3: Create `netlify.toml`**

```toml
[build]
  publish = "."

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

- [ ] **Step 4: Create `_redirects`** (Netlify also serves `/about-us` from `about-us.html` via Pretty URLs; this guarantees extension stripping)

```
/about-us.html       /about-us       301
/services.html       /services       301
/contact-us.html     /contact-us     301
/appointment.html    /appointment    301
```

- [ ] **Step 5: Create `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://sunesismedical.com/sitemap.xml
```
(Domain is a placeholder; confirm real domain before launch — leave an HTML-comment note in sitemap task.)

- [ ] **Step 6: Create `serve.py` (local clean-URL preview)**

```python
#!/usr/bin/env python3
"""Local preview server that serves extensionless clean URLs.

Maps /about-us -> about-us.html and /services/mobile-care -> services/mobile-care.html
so local preview matches Vercel/Netlify cleanUrls behavior. Run: python serve.py
"""
import http.server
import os
import socketserver

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path.split("?", 1)[0].split("#", 1)[0])
        if os.path.isdir(local):
            index = os.path.join(local, "index.html")
            if os.path.isfile(index):
                return index
        if not os.path.splitext(local)[1] and os.path.isfile(local + ".html"):
            return local + ".html"
        return local


os.chdir(ROOT)
with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
    print(f"Serving {ROOT} at http://localhost:{PORT}")
    httpd.serve_forever()
```

- [ ] **Step 7: Create empty `assets/css/sunesis.css` and `assets/js/sunesis.js`**

Create both as empty files (filled in Tasks 2-3, 5).

- [ ] **Step 8: Verify server starts**

Run: `python serve.py` (background), then `preview_start` at `http://localhost:8000`.
Expected: server prints "Serving ... at http://localhost:8000". A request to `/robots.txt` returns the robots content. (No pages yet — 404 on `/` is expected until Task 6.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: remove old template, scaffold static structure, host config, preview server"
```

---

### Task 2: Design tokens + base/reset CSS

**Files:**
- Modify: `assets/css/sunesis.css`

- [ ] **Step 1: Write tokens + reset + base typography at top of `sunesis.css`**

```css
/* ============================================================
   Sunesis Medical Services — design system
   ============================================================ */
:root {
  /* Brand */
  --teal: #025754;
  --teal-700: #014542;
  --teal-300: #2e7d7a;
  --green: #50bb7a;
  --green-600: #3da366;
  --green-100: #e7f6ee;

  /* Neutrals */
  --ink: #0e1b1a;
  --ink-60: #4a5957;
  --surface: #f7f9f8;
  --white: #ffffff;
  --line: #e3e9e7;

  /* UI */
  --radius: 14px;
  --radius-sm: 10px;
  --shadow: 0 10px 30px -12px rgba(2, 87, 84, 0.18);
  --section-y: clamp(4rem, 9vw, 8rem);
  --container: 1180px;
  --gutter: clamp(1.25rem, 4vw, 2.5rem);

  /* Type */
  --font: "Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  --fs-hero: clamp(2.6rem, 6vw, 4.6rem);
  --fs-h2: clamp(1.9rem, 3.6vw, 2.9rem);
  --fs-h3: clamp(1.3rem, 2.2vw, 1.7rem);
  --fs-body: clamp(1rem, 1.1vw, 1.125rem);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font);
  font-weight: 400;
  font-size: var(--fs-body);
  line-height: 1.65;
  color: var(--ink);
  background: var(--white);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
a { color: var(--teal); text-decoration: none; }
a:hover { color: var(--green-600); }
h1, h2, h3, h4 { margin: 0 0 .5em; line-height: 1.12; font-weight: 600; letter-spacing: -0.01em; }
p { margin: 0 0 1rem; }
:focus-visible { outline: 3px solid var(--green); outline-offset: 2px; border-radius: 4px; }

.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: var(--section-y); }
.section--surface { background: var(--surface); }
.section--teal { background: var(--teal); color: var(--white); }
.section--teal h1, .section--teal h2, .section--teal h3 { color: var(--white); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Add Inter to a temporary `index.html` head is not needed yet — verify CSS parses**

Run: load `http://localhost:8000/assets/css/sunesis.css` in `preview_eval` via `fetch('/assets/css/sunesis.css').then(r=>r.text()).then(t=>t.length)`.
Expected: returns a positive length (file served, no server error).

- [ ] **Step 3: Commit**

```bash
git add assets/css/sunesis.css
git commit -m "feat(css): add design tokens, reset, and base typography"
```

---

### Task 3: Component CSS (buttons, eyebrow, section header, cards, forms, steps, FAB)

**Files:**
- Modify: `assets/css/sunesis.css` (append)

- [ ] **Step 1: Append component styles**

```css
/* ---- Buttons ---- */
.btn { display: inline-flex; align-items: center; gap: .5rem; font-weight: 500;
  font-size: 1rem; padding: .85rem 1.5rem; border-radius: 999px; border: 2px solid transparent;
  cursor: pointer; transition: background .2s, color .2s, border-color .2s, transform .2s; }
.btn:active { transform: translateY(1px); }
.btn--primary { background: var(--green); color: #03261a; border-color: var(--green); }
.btn--primary:hover { background: var(--green-600); border-color: var(--green-600); color: #fff; }
.btn--ghost { background: transparent; color: var(--teal); border-color: var(--teal); }
.btn--ghost:hover { background: var(--teal); color: #fff; }
.section--teal .btn--ghost { color: #fff; border-color: rgba(255,255,255,.6); }
.section--teal .btn--ghost:hover { background: #fff; color: var(--teal); }
.btn svg { width: 1.05em; height: 1.05em; }

/* ---- Eyebrow + section header ---- */
.eyebrow { display: inline-block; font-size: .8rem; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--green-600); margin-bottom: .9rem; }
.section--teal .eyebrow { color: var(--green); }
.sec-head { max-width: 720px; }
.sec-head--center { margin-inline: auto; text-align: center; }
.sec-head h2 { font-size: var(--fs-h2); }
.lead { color: var(--ink-60); font-size: 1.1rem; }
.section--teal .lead { color: rgba(255,255,255,.82); }

/* ---- Cards ---- */
.grid { display: grid; gap: 1.5rem; }
.grid--2 { grid-template-columns: repeat(2, 1fr); }
.grid--3 { grid-template-columns: repeat(3, 1fr); }
.grid--4 { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 900px) { .grid--3, .grid--4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .grid--2, .grid--3, .grid--4 { grid-template-columns: 1fr; } }

.card { background: var(--white); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 1.75rem; display: flex; flex-direction: column; gap: .6rem; transition: box-shadow .2s, transform .2s; }
.card:hover { box-shadow: var(--shadow); transform: translateY(-3px); }
.card__icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 12px;
  background: var(--green-100); color: var(--teal); margin-bottom: .4rem; }
.card__icon svg { width: 24px; height: 24px; }
.card h4 { font-size: 1.2rem; }
.card .more { margin-top: auto; font-weight: 500; color: var(--green-600); display: inline-flex; gap: .35rem; align-items: center; }

/* ---- Feature row (Why Choose) ---- */
.feature { display: flex; gap: 1rem; }
.feature__tick { flex: none; width: 28px; height: 28px; border-radius: 50%; background: var(--green-100);
  color: var(--green-600); display: grid; place-items: center; }
.feature__tick svg { width: 16px; height: 16px; }

/* ---- How It Works steps ---- */
.steps { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.steps::before { content: ""; position: absolute; top: 32px; left: 12%; right: 12%; height: 2px;
  background: var(--line); z-index: 0; }
@media (max-width: 820px) { .steps { grid-template-columns: 1fr; } .steps::before { display: none; } }
.step { position: relative; z-index: 1; text-align: center; }
.step__node { width: 64px; height: 64px; margin: 0 auto 1rem; border-radius: 50%; background: var(--white);
  border: 2px solid var(--line); color: var(--teal); display: grid; place-items: center;
  transition: border-color .25s, background .25s, color .25s; }
.step__node svg { width: 26px; height: 26px; }
.step.is-active .step__node { border-color: var(--green); background: var(--green); color: #03261a; }
.step h4 { font-size: 1.1rem; }
.step p { color: var(--ink-60); font-size: .98rem; }

/* ---- Avatars / image slots ---- */
.imgslot { background: linear-gradient(135deg, var(--teal) 0%, var(--green) 140%);
  border-radius: var(--radius); aspect-ratio: 4/3; object-fit: cover; width: 100%; }
.avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover;
  background: var(--green-100); flex: none; }

/* ---- Forms ---- */
.field { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1rem; }
.field label { font-weight: 500; font-size: .95rem; }
.field input, .field select, .field textarea { font: inherit; padding: .8rem 1rem; border: 1px solid var(--line);
  border-radius: var(--radius-sm); background: var(--white); color: var(--ink); }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: var(--green);
  box-shadow: 0 0 0 3px var(--green-100); }
.form-note { color: var(--ink-60); font-size: .9rem; }
.form-success { display: none; background: var(--green-100); border: 1px solid var(--green);
  border-radius: var(--radius-sm); padding: 1rem 1.25rem; color: var(--teal-700); margin-bottom: 1rem; }
.form-success.is-visible { display: block; }

/* ---- Reveal animation ---- */
.reveal { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.reveal.is-in { opacity: 1; transform: none; }

/* ---- Badge ---- */
.badge { display: inline-block; font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  color: var(--green-600); background: var(--green-100); padding: .25rem .6rem; border-radius: 999px; }
```

- [ ] **Step 2: Verify CSS still parses (no syntax break)**

Run via `preview_eval`: `fetch('/assets/css/sunesis.css').then(r=>r.text()).then(t=>/\.btn--primary/.test(t))`.
Expected: `true`.

- [ ] **Step 3: Commit**

```bash
git add assets/css/sunesis.css
git commit -m "feat(css): add component styles (buttons, cards, steps, forms, reveal)"
```

---

### Task 4: Canonical chrome (head, top bar, header/nav, footer, FAB) + chrome CSS

Define the shared markup ONCE here. Every page (Tasks 6-15) pastes these blocks verbatim, changing only `<title>`, `<meta name="description">`, the page JSON-LD, and adding `aria-current="page"` to the active nav link.

**Files:**
- Modify: `assets/css/sunesis.css` (append chrome styles)
- Create: `docs/_chrome-snippets.md` (reference copy of canonical blocks for paste)

- [ ] **Step 1: Append chrome CSS**

```css
/* ---- Top bar ---- */
.topbar { background: var(--teal-700); color: rgba(255,255,255,.85); font-size: .85rem; }
.topbar .container { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; align-items: center; justify-content: space-between; padding-block: .5rem; }
.topbar a { color: rgba(255,255,255,.85); display: inline-flex; gap: .4rem; align-items: center; }
.topbar a:hover { color: #fff; }
.topbar .wa { background: var(--green); color: #03261a; padding: .35rem .8rem; border-radius: 999px; font-weight: 500; }
.topbar .topbar__contact { display: flex; flex-wrap: wrap; gap: .4rem 1.25rem; }

/* ---- Header ---- */
.site-header { position: sticky; top: 0; z-index: 50; background: var(--white); border-bottom: 1px solid var(--line); }
.site-header .container { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block: .85rem; }
.brand img { height: 42px; width: auto; }
.nav { display: flex; align-items: center; gap: 2rem; }
.nav a { color: var(--ink); font-weight: 500; }
.nav a:hover, .nav a[aria-current="page"] { color: var(--green-600); }
.nav-toggle { display: none; background: none; border: 0; cursor: pointer; color: var(--teal); }
.nav-toggle svg { width: 28px; height: 28px; }
@media (max-width: 860px) {
  .nav-toggle { display: inline-flex; }
  .nav { position: fixed; inset: 0 0 0 auto; width: min(80vw, 320px); background: #fff; flex-direction: column;
    align-items: flex-start; gap: 1.25rem; padding: 5rem 2rem; transform: translateX(100%); transition: transform .3s;
    box-shadow: var(--shadow); }
  .nav.is-open { transform: none; }
  .nav .btn { width: 100%; justify-content: center; }
}

/* ---- Footer ---- */
.site-footer { background: var(--teal); color: rgba(255,255,255,.8); padding-block: 3.5rem 2rem; }
.site-footer a { color: rgba(255,255,255,.8); }
.site-footer a:hover { color: #fff; }
.site-footer .foot-grid { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; align-items: start; }
.site-footer .brand img { height: 40px; }
.site-footer .foot-links { display: flex; gap: 2.5rem; flex-wrap: wrap; }
.site-footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
.site-footer .colophon { border-top: 1px solid rgba(255,255,255,.15); margin-top: 2.5rem; padding-top: 1.5rem;
  display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; justify-content: space-between; font-size: .85rem; }

/* ---- WhatsApp FAB + scroll top ---- */
.wa-fab { position: fixed; right: 20px; bottom: 20px; z-index: 60; width: 56px; height: 56px; border-radius: 50%;
  background: var(--green); color: #03261a; display: grid; place-items: center; box-shadow: var(--shadow); }
.wa-fab:hover { background: var(--green-600); color: #fff; }
.wa-fab svg { width: 30px; height: 30px; }
.scroll-top { position: fixed; right: 20px; bottom: 88px; z-index: 60; width: 44px; height: 44px; border-radius: 50%;
  background: var(--teal); color: #fff; border: 0; display: grid; place-items: center; opacity: 0; pointer-events: none;
  transition: opacity .3s; cursor: pointer; }
.scroll-top.is-visible { opacity: 1; pointer-events: auto; }

/* ---- Page hero (interior pages) ---- */
.page-hero { background: var(--teal); color: #fff; padding-block: clamp(3rem,7vw,6rem); }
.page-hero .eyebrow { color: var(--green); }
.page-hero h1 { font-size: clamp(2.1rem,4.5vw,3.4rem); }
.page-hero p { color: rgba(255,255,255,.85); max-width: 640px; }
```

- [ ] **Step 2: Write canonical chrome blocks to `docs/_chrome-snippets.md`**

Include these four blocks verbatim (engineer pastes into each page). SVG icons are inline.

HEAD block (replace `{{TITLE}}`, `{{DESC}}`, `{{JSONLD}}` per page; `{{REL}}` is `""` for root pages and `"../"` for files under `/services/`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{TITLE}}</title>
<meta name="description" content="{{DESC}}">
<meta name="author" content="Sunesis Medical Services">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/sunesis.css">
{{JSONLD}}
</head>
<body>
```

TOPBAR + HEADER block (set `aria-current="page"` on the active link per page):

```html
<div class="topbar">
  <div class="container">
    <div class="topbar__contact">
      <a href="/contact-us">Mobile Service · Kampala &amp; Surrounding Areas</a>
      <a href="mailto:sunesismedicalservices@gmail.com">sunesismedicalservices@gmail.com</a>
      <a href="tel:+256758942379">+256 758 942379</a>
    </div>
    <a class="wa" href="https://wa.me/256758942379?text=Hi%2C%20I%27d%20like%20to%20book%20a%20mobile%20visit" target="_blank" rel="noopener">Chat on WhatsApp</a>
  </div>
</div>
<header class="site-header">
  <div class="container">
    <a class="brand" href="/" aria-label="Sunesis Medical Services home">
      <img src="/assets/images/logos/logo-white-bg.png" alt="Sunesis Medical Services logo">
    </a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <nav class="nav" id="primary-nav">
      <a href="/">Home</a>
      <a href="/about-us">About Us</a>
      <a href="/services">Our Services</a>
      <a href="/contact-us">Contact</a>
      <a class="btn btn--primary" href="/appointment">Book a Mobile Visit</a>
    </nav>
  </div>
</header>
```

FOOTER + FAB + SCRIPT block (closes the page):

```html
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/"><img src="/assets/images/logos/logo-white-bg.png" alt="Sunesis Medical Services logo"></a>
        <p style="margin-top:1rem;max-width:320px">Holistic, mobile healthcare delivered at your home, workplace, or school across Kampala and surrounding areas.</p>
        <p>Kampala, Uganda<br>
          <a href="mailto:sunesismedicalservices@gmail.com">sunesismedicalservices@gmail.com</a><br>
          <a href="tel:+256758942379">+256 758 942379</a></p>
      </div>
      <div class="foot-links">
        <ul>
          <li><strong style="color:#fff">Explore</strong></li>
          <li><a href="/about-us">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/appointment">Book a Visit</a></li>
          <li><a href="/contact-us">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="colophon">
      <span>&copy; <span data-year>2026</span> Sunesis Medical Services. All Rights Reserved.</span>
      <span>Powered by <a href="https://grayhost.dev" target="_blank" rel="noopener">Grayhost Innovations</a></span>
    </div>
  </div>
</footer>
<a class="wa-fab" href="https://wa.me/256758942379?text=Hi%2C%20I%27d%20like%20to%20book%20a%20mobile%20visit" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3-.8-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2 1.3 2.3 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.3z"/></svg>
</a>
<button class="scroll-top" aria-label="Scroll to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
</button>
<script src="/assets/js/sunesis.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Verify chrome CSS parses**

Run via `preview_eval`: `fetch('/assets/css/sunesis.css').then(r=>r.text()).then(t=>/\.wa-fab/.test(t)&&/\.site-header/.test(t))`.
Expected: `true`.

- [ ] **Step 4: Commit**

```bash
git add assets/css/sunesis.css docs/_chrome-snippets.md
git commit -m "feat: add canonical chrome markup and chrome/hero styles"
```

---

### Task 5: Behavior (`assets/js/sunesis.js`)

**Files:**
- Modify: `assets/js/sunesis.js`

- [ ] **Step 1: Write the full JS**

```js
// Sunesis Medical Services — site behavior
(function () {
  "use strict";

  // Dynamic year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll-to-top button
  var top = document.querySelector(".scroll-top");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("is-visible", window.scrollY > 600);
    });
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll-reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // How It Works active step on scroll-into-view
  var steps = document.querySelectorAll(".step");
  if ("IntersectionObserver" in window && steps.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          steps.forEach(function (s) { s.classList.remove("is-active"); });
          e.target.classList.add("is-active");
        }
      });
    }, { threshold: 0.6 });
    steps.forEach(function (s) {
      s.addEventListener("mouseenter", function () {
        steps.forEach(function (x) { x.classList.remove("is-active"); });
        s.classList.add("is-active");
      });
      sio.observe(s);
    });
  }

  // Forms -> WhatsApp composer
  var WA = "https://wa.me/256758942379?text=";
  document.querySelectorAll("form[data-wa]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var intro = form.getAttribute("data-wa-intro") || "Hello Sunesis, I'd like to get in touch.";
      var lines = [intro, ""];
      form.querySelectorAll("[name]").forEach(function (input) {
        if (!input.value) return;
        var label = input.getAttribute("data-label") || input.name;
        lines.push(label + ": " + input.value);
      });
      window.open(WA + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      var ok = form.querySelector(".form-success");
      if (ok) { ok.classList.add("is-visible"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.reset();
    });
  });
})();
```

- [ ] **Step 2: Verify JS served and syntactically valid**

Run via `preview_eval`: `fetch('/assets/js/sunesis.js').then(r=>r.text()).then(t=>{ new Function(t); return true; })`.
Expected: `true` (no syntax error thrown by `new Function`).

- [ ] **Step 3: Commit**

```bash
git add assets/js/sunesis.js
git commit -m "feat(js): nav toggle, scroll reveal, step highlight, form->WhatsApp, scroll-top"
```

---

### Task 6: Home page (`index.html`)

**Files:**
- Create: `index.html`

Paste HEAD (TITLE `Sunesis Medical Services | Mobile & Home Healthcare in Kampala`; DESC `Holistic, mobile healthcare delivered to your home, workplace, or school across Kampala and surrounding areas — home doctor visits, nursing, mental health, corporate wellness, and first aid training.`; JSONLD = the MedicalBusiness block from Task 16; REL `""`), then TOPBAR+HEADER with `aria-current="page"` on Home, then the sections below, then FOOTER block.

- [ ] **Step 1: Build the 9 content sections**

Use exact copy from spec §7.1. Section blueprints (classes from Tasks 2-4):

1. Hero — `<section class="page-hero">` style but full-bleed teal with two columns: left text (eyebrow "Wisdom in Care. Excellence in Service.", `<h1 style="font-size:var(--fs-hero)">Care That Goes Beyond Hospital Walls</h1>`, sub paragraph, two CTAs: `<a class="btn btn--primary" href="/appointment">Book a Mobile Visit</a>` + `<a class="btn btn--ghost" href="/contact-us">Request Corporate Services</a>`), right `<img class="imgslot" src="/assets/images/hero-section.jpg" alt="A Sunesis nurse providing mobile healthcare to a patient at home in Kampala">`.
2. `<section class="section">` Doorstep — eyebrow "Care Beyond Hospital Walls", h2 "Professional Care at Your Doorstep", body, CTAs "Explore Mobile Care" (`/services/mobile-care`) / "Schedule a Visit" (`/appointment`). Paired `nurse-and-doctor.jpg`.
3. `<section class="section section--surface">` Whole Person — eyebrow "Body. Mind. Environment.", h2 "Care for the Whole Person", body, CTAs "Mental Health Support" (`/services/mental-health`) / "Learn About Sunesis" (`/about-us`).
4. `<section class="section">` About Sunesis — two columns: text (h2 "Wisdom in Care. Excellence in Service.", narrative paragraphs, blockquote, signature "Dr. Joel Omoding, Chief Executive Officer", CTA "Learn More About Us" `/about-us`) + "At a Glance" card listing: Certified Professionals, Fast Response Time, Confidential & Patient-Centered, Affordable Packages, Holistic Approach to Health (use `.feature` rows with check SVG).
5. `<section class="section section--surface">` Services — centered head h2 "Comprehensive Mobile Healthcare" + subhead, `.grid .grid--3` (then wrap) of 5 `.card` items with icon, title, teaser, "Learn More" link to each detail page; CTA "View Full Services" `/services`.
6. `<section class="section">` How It Works — centered head, `.steps` with 4 `.step` (each `.step__node` + inline SVG icon, h4, tightened copy), CTA "Book Your Mobile Visit Today" `/appointment`. Add `reveal` to each step.
7. `<section class="section section--teal">` Why Choose — h2 "Wisdom in Care. Excellence in Service.", intro, `.grid--2` of 4 `.feature` blocks (Convenience, Comprehensive Care, Personalized Approach, Professional & Confidential).
8. `<section class="section">` Testimonials — head h2 "What Our Clients and Team Say" + subhead. `.grid--2` of 4 client `.card` (quote, name, role, `.avatar` img slot e.g. `/assets/images/testimonials/sarah-nakamya.jpg`). Then a sub-head "From Our Team" with 3 placeholder team cards. Wrap client block in HTML comment `<!-- NEEDS CLIENT VERIFICATION: confirm these are real attributed quotes -->` and team block in `<!-- NEEDS CLIENT INPUT: replace placeholder team quotes before publishing -->`.
9. `<section class="section section--surface">` Partners — `<!-- NEEDS CLIENT INPUT: confirm label (Trusted By / Our Partners / Accredited By) and supply logos -->` heading "Trusted By" + a `.grid--4` of `<img>` slots (`/assets/images/partners/partner-1.png` ...).

Use SVG icons inline for service/step/feature icons (calendar, user-check, home, heart for steps; simple medical glyphs for services). Add `class="reveal"` to cards and steps for progressive reveal.

- [ ] **Step 2: Verify render**

`preview_start`/reload `http://localhost:8000/`. Run `preview_console_logs` (expect none), `preview_snapshot` (confirm hero H1 text, 5 service cards, 4 steps, footer). `preview_screenshot` for the hero — confirm white text on teal, readable.

- [ ] **Step 3: Verify nav + reveal + step highlight work**

`preview_resize` to 800px wide; `preview_click` the `.nav-toggle`; `preview_snapshot` confirms nav `is-open`. Scroll via `preview_eval` `window.scrollTo(0, 2000)`; confirm a `.step` has `is-active`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: build home page"
```

---

### Task 7: About Us (`about-us.html`)

**Files:**
- Create: `about-us.html`

HEAD (TITLE `About Sunesis | Holistic Mobile Healthcare in Kampala`; DESC `Sunesis Medical Services brings holistic, whole-person care — body, mind, and environment — to homes, workplaces, and schools across Kampala. Meet our mission, values, and medical team.`). Active nav: About Us.

- [ ] **Step 1: Build sections (spec §7.2)**

1. `.page-hero` with At-a-Glance band: 4 chips (Mobile & Home-Based Care; Serving Kampala & Beyond; Individuals, Families & Organizations; Holistic, Whole-Person Care).
2. `.section` Who We Are — h2 "Wisdom in Care. Excellence in Service.", full body, signature "Dr. Joel Omoding, Chief Executive Officer". Paired image `02_about.jpg`.
3. `.section section--surface` Our Purpose — `.grid--2`: Mission card + Vision card (full copy).
4. `.section` Our Approach — h2 "Care for the Whole Person", intro, `.grid--3`: Body / Mind / Environment cards with icons.
5. `.section section--surface` Our Values — `.grid--4`: Compassion / Integrity / Accessibility / Confidentiality.
6. `.section` Meet Our Medical Team — h2 "The People Behind Your Care", intro, `.grid--4` of team cards: Dr. Gift `<!-- NEEDS CLIENT INPUT: title/specialty -->`, Dr. Eve (Physician), Dr. Joshua `<!-- NEEDS CLIENT INPUT: title/specialty -->`, Dr. Rachel (Emergency Physician). Each card has `.avatar`/`.imgslot` headshot slot (`/assets/images/team/dr-eve.jpg` etc.) and no invented titles.
7. `.section section--teal` Closing CTA band — h2 "Healthcare That Comes to You", body, CTAs "Book a Mobile Visit" `/appointment` / "Contact Us" `/contact-us`.

- [ ] **Step 2: Verify** — reload `/about-us`, `preview_console_logs` (none), `preview_snapshot` confirms 4 team cards and both NEEDS-INPUT comments present in source.

- [ ] **Step 3: Commit**

```bash
git add about-us.html
git commit -m "feat: build about-us page"
```

---

### Task 8: Services overview (`services.html`)

**Files:**
- Create: `services.html`

HEAD (TITLE `Our Services | Mobile Healthcare, Wellness & First Aid — Sunesis`; DESC `Explore Sunesis Medical Services: mobile and on-demand care, corporate and institutional wellness, mental health support, medical travel documentation, and first aid training in Kampala, Uganda.`). Active nav: Our Services.

- [ ] **Step 1: Build** — `.page-hero` (h1 "Comprehensive Mobile Healthcare", intro), then `.section` with `.grid--3`(wrap) of the same 5 `.card`s as home (teaser copy), each linking to its detail page.

- [ ] **Step 2: Verify** — reload `/services`; confirm 5 cards each link to `/services/...`.

- [ ] **Step 3: Commit**

```bash
git add services.html
git commit -m "feat: build services overview page"
```

---

### Task 9: Service detail pages — Mobile Care, Corporate, Medical Travel

These three share a layout: `.page-hero` (eyebrow, h1, intro) → `.section` two-column (What's Included list with green checks + paired photo) → `.section section--surface` "Who It's For" → `.section section--teal` CTA band. `{{REL}}` paths: assets are root-relative (`/assets/...`) so REL is irrelevant; nav links are root-relative.

**Files:**
- Create: `services/mobile-care.html`, `services/corporate-health.html`, `services/medical-travel.html`

- [ ] **Step 1: Mobile & On-Demand Care** (spec §7.4) — TITLE `Home Doctor Visits & Mobile Nursing in Kampala | Sunesis`; DESC includes "home doctor visit Kampala" and "mobile nurse Uganda". h1 "Healthcare Without the Waiting Room"; 6 What's Included items; Who It's For; CTA "Schedule a Mobile Visit" `/appointment`. Photo `nurse-and-doctor.jpg` / `in-the-ambulance.jpg`.

- [ ] **Step 2: Corporate & Institutional** — TITLE `Corporate Health Screening & School Wellness Uganda | Sunesis`; DESC includes "corporate health screening Uganda". h1 "Wellness Built Into the Workplace and the Classroom"; 5 items; Who It's For; CTA "Request Corporate Services" `/contact-us`.

- [ ] **Step 3: Medical Travel** — TITLE `Travel Medical Clearances & Vaccination Certificates | Sunesis`; DESC. h1 "Travel Documentation, Handled Properly"; 4 items; Who It's For; CTA "Request Travel Documentation" `/contact-us`. Photo `medical-travel.jpg`.

- [ ] **Step 4: Verify** — reload each of `/services/mobile-care`, `/services/corporate-health`, `/services/medical-travel`; `preview_console_logs` none; confirm headlines and CTAs.

- [ ] **Step 5: Commit**

```bash
git add services/mobile-care.html services/corporate-health.html services/medical-travel.html
git commit -m "feat: build mobile-care, corporate-health, medical-travel service pages"
```

---

### Task 10: Service detail — Mental Health (rehab omitted)

**Files:**
- Create: `services/mental-health.html`

- [ ] **Step 1: Build** (spec §7.4) — TITLE `Confidential Counseling & Mental Health Support | Sunesis`; DESC. h1 "Confidential Care for the Mind"; intro; 3 What's Included items (confidential one-on-one counseling; professional diagnosis and therapy; anxiety, depression, and stress management). **Do NOT list rehabilitation. Do NOT use the name "Epignosis" anywhere.** Add HTML comment `<!-- PHASE NOTE: rehab/reintegration is a future offering pending physical premises; do not list yet. Do not use the name "Epignosis". -->`. Who It's For; CTA "Book a Confidential Session" `/appointment`. Photo `mental-health.jpg` or `counselling.jpg`.

- [ ] **Step 2: Verify** — reload `/services/mental-health`; grep the file to confirm "Epignosis" and "rehabilitation" do NOT appear in visible content. Run: `git grep -i "epignosis\|rehabilitation" services/mental-health.html` → expected: only matches inside the HTML comment (or none).

- [ ] **Step 3: Commit**

```bash
git add services/mental-health.html
git commit -m "feat: build mental-health service page (rehab omitted per phase note)"
```

---

### Task 11: Service detail — First Aid + Coming Soon resources

**Files:**
- Create: `services/first-aid.html`

- [ ] **Step 1: Build core** (spec §7.4) — TITLE `First Aid & CPR Training in Kampala | Sunesis`; DESC includes "first aid training Kampala" and "CPR training Uganda". h1 "First Aid That's Ready Before You Need It"; intro; 7 What's Included items; Who It's For; "Why It Matters" block; CTAs "Book First Aid Training" `/appointment` / "Request Event Coverage" `/contact-us`. Photos `first-aid-training.jpg`, `first-aid-service.jpg`, `bandaging.jpg`.

- [ ] **Step 2: Build Coming Soon: Training Resources** — `.section section--surface`: intro line "We're building a library of practical training resources. Join the list below to be notified the moment they launch." A `form data-wa data-wa-intro="Hi Sunesis, please notify me when training resources launch."` with one email `.field` + submit "Notify Me When This Launches" + `.form-success` ("Thanks — we'll be in touch when resources launch."). Then two `.grid--3` rows of cards each with `.badge` "Coming Soon": 6 workbook cards titled `Workbook 1` … `Workbook 6` each wrapped with `<!-- NEEDS CLIENT INPUT: workbook title -->`, and 4 course cards (First Aid; BLS (Basic Life Support); ACLS (Advanced Cardiac Life Support); CABS (Child and Baby Sitting Safety)) each with one-line description wrapped `<!-- NEEDS CLIENT INPUT: course one-line description -->`. No anchors with empty/`#` href.

- [ ] **Step 3: Verify** — reload `/services/first-aid`; submit the Notify form via `preview_fill` (email) + `preview_click` submit; confirm `.form-success` becomes visible and a `wa.me` window is attempted (check `preview_console_logs` / network). Confirm no `href="#"` in file: `git grep 'href="#"' services/first-aid.html` → expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add services/first-aid.html
git commit -m "feat: build first-aid service page with coming-soon resources and notify form"
```

---

### Task 12: Contact (`contact-us.html`)

**Files:**
- Create: `contact-us.html`

HEAD (TITLE `Contact Sunesis Medical Services | Kampala Mobile Healthcare`; DESC). Active nav: Contact.

- [ ] **Step 1: Build** (spec §7.5) — `.page-hero` (h1 "Get in Touch", intro). `.section` two-column: left = contact details (phone, email, Service Area Kampala & surrounding areas) + prominent `<a class="btn btn--primary" href="tel:+256758942379">Call Now</a>` + `<a class="btn btn--ghost" href="https://wa.me/256758942379?text=...">Chat on WhatsApp</a>`; right = `<form data-wa data-wa-intro="Hello Sunesis, I have an enquiry.">` with `.form-success`, fields Name, Phone, Email, Service Interested In (`<select>` of the 5 services), Message — each input has `data-label`. Below: `.section section--surface` with a Google Maps `<iframe>` embed centered on Kampala (service-area, `loading="lazy"`, titled). Add `<!-- Confirm exact service-area framing of map before launch -->`.

- [ ] **Step 2: Verify** — reload `/contact-us`; fill form via `preview_fill`, submit, confirm `.form-success` visible; confirm map iframe present.

- [ ] **Step 3: Commit**

```bash
git add contact-us.html
git commit -m "feat: build contact page with WhatsApp form, click-to-call, service-area map"
```

---

### Task 13: Appointment / Booking (`appointment.html`)

**Files:**
- Create: `appointment.html`

HEAD (TITLE `Book a Mobile Visit | Sunesis Medical Services Kampala`; DESC). No active top-nav link (it's the CTA button).

- [ ] **Step 1: Build** (spec §7.6) — `.page-hero` (h1 "Book Your Mobile Visit", intro). `.section` centered narrow column with `<form data-wa data-wa-intro="Hi Sunesis, I'd like to book a mobile visit.">` + `.form-success` ("Your request has been prepared in WhatsApp — send it and we'll confirm and dispatch a professional."). Fields with `data-label`: Full Name, Phone, Email, Service Requested (`<select>`: 5 services + "First Aid Training / Coverage"), Preferred Date (`type=date`), Preferred Time (`type=time`), Location/Address, Additional Notes (`<textarea>`). Submit "Request My Visit". Helper `.form-note` explaining the request opens WhatsApp to send.

- [ ] **Step 2: Verify** — reload `/appointment`; fill + submit; confirm `.form-success` visible and WhatsApp composed with field labels.

- [ ] **Step 3: Commit**

```bash
git add appointment.html
git commit -m "feat: build appointment/booking page (WhatsApp submission + confirmation)"
```

---

### Task 14: SEO — JSON-LD, per-page meta audit, sitemap

**Files:**
- Modify: all 10 pages (insert JSON-LD where `{{JSONLD}}` placeholder is)
- Create: `sitemap.xml`

- [ ] **Step 1: Insert MedicalBusiness JSON-LD into `index.html` head**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Sunesis Medical Services",
  "description": "Holistic, mobile healthcare delivered at your home, workplace, or school across Kampala and surrounding areas.",
  "telephone": "+256758942379",
  "email": "sunesismedicalservices@gmail.com",
  "areaServed": "Kampala and surrounding areas, Uganda",
  "founder": { "@type": "Person", "name": "Dr. Joel Omoding" },
  "availableService": [
    { "@type": "MedicalProcedure", "name": "Mobile & On-Demand Care" },
    { "@type": "MedicalProcedure", "name": "Corporate & Institutional Services" },
    { "@type": "MedicalProcedure", "name": "Specialized & Mental Health" },
    { "@type": "MedicalProcedure", "name": "Medical Travel Services" },
    { "@type": "MedicalProcedure", "name": "First Aid Services & Training" }
  ]
}
</script>
```

- [ ] **Step 2: Confirm each page has a unique title + description** (no Home/About duplication). Run: `git grep -h "<title>" *.html services/*.html` and eyeball uniqueness. Service pages may carry a lighter JSON-LD (`MedicalProcedure`) or none; Home carries the full block.

- [ ] **Step 3: Create `sitemap.xml`** (replace domain placeholder before launch — add a comment)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Replace https://sunesismedical.com with the real production domain before launch -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sunesismedical.com/</loc></url>
  <url><loc>https://sunesismedical.com/about-us</loc></url>
  <url><loc>https://sunesismedical.com/services</loc></url>
  <url><loc>https://sunesismedical.com/services/mobile-care</loc></url>
  <url><loc>https://sunesismedical.com/services/corporate-health</loc></url>
  <url><loc>https://sunesismedical.com/services/mental-health</loc></url>
  <url><loc>https://sunesismedical.com/services/medical-travel</loc></url>
  <url><loc>https://sunesismedical.com/services/first-aid</loc></url>
  <url><loc>https://sunesismedical.com/contact-us</loc></url>
  <url><loc>https://sunesismedical.com/appointment</loc></url>
</urlset>
```

- [ ] **Step 4: Verify** — `git grep -c "<title>"` across pages = 10 unique; JSON-LD validates (paste into a JSON linter via `preview_eval` `JSON.parse` on the script content of `/`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(seo): JSON-LD, unique per-page meta, sitemap.xml"
```

---

### Task 15: Image manifest + oversized-image compression

**Files:**
- Create: `docs/IMAGE-MANIFEST.md`
- Modify: oversized JPGs in `assets/images/`

- [ ] **Step 1: Write `docs/IMAGE-MANIFEST.md`** listing every client-supplied slot with exact path + recommended dimensions:
  - Team headshots: `assets/images/team/dr-gift.jpg`, `dr-eve.jpg`, `dr-joshua.jpg`, `dr-rachel.jpg` (square, ~600×600).
  - Testimonial portraits: `assets/images/testimonials/sarah-nakamya.jpg`, `david-okello.jpg`, `grace-a.jpg`, `james-wasswa.jpg` (square, ~300×300).
  - Partners: `assets/images/partners/partner-1.png` … (transparent PNG, ~240px wide).
  - Existing-photo → page mapping table (hero-section, nurse-and-doctor, mental-health, counselling, medical-travel, first-aid-*, bandaging, in-the-ambulance).

- [ ] **Step 2: Compress oversized photos** (several are 1–3 MB). For each JPG > ~500 KB, re-encode to ~1600px max width, quality ~80. If a tool is unavailable, document the list of files needing compression in the manifest under "Pre-launch: compress these" rather than skipping silently.

```bash
# Example using ImageMagick if available:
magick "assets/images/first-aid-medicines.jpg" -resize "1600x1600>" -quality 80 "assets/images/first-aid-medicines.jpg"
```

- [ ] **Step 3: Verify** — confirm referenced existing photos still load (`preview_console_logs` shows no 404 for in-use images on each page).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: image manifest; chore: compress oversized photos"
```

---

### Task 16: Final verification — links, contrast, Lighthouse, deliverable summary

**Files:**
- Create: `docs/REBUILD-SUMMARY.md`

- [ ] **Step 1: Crawl internal links** — via `preview_eval`, collect all `<a href>` on each page and fetch each internal target; expect HTTP 200 (no broken extensionless links, no `#` dead links except intentional in-page anchors). Record results.

- [ ] **Step 2: Contrast check** — verify hero (white on `#025754`) and body (`#0e1b1a` on white / `#f7f9f8`) meet WCAG AA. Use `preview_inspect` on hero h1 and a body paragraph; compute ratio (teal #025754 vs white ≈ 8.9:1 AAA; ink vs white ≈ 16:1). Record.

- [ ] **Step 3: Lighthouse** — run a Lighthouse pass (via Chrome devtools / CLI if available) on `/`; record Performance/Accessibility/Best-Practices/SEO. If the runner is unavailable in-environment, note that and report the manual checks instead. Capture before/after note (before = old template).

- [ ] **Step 4: Write `docs/REBUILD-SUMMARY.md`** — per section: what changed structurally, visually, and in copy vs the old live site; and a consolidated list of every NEEDS CLIENT VERIFICATION / NEEDS CLIENT INPUT item (testimonials, team quotes, Dr. Gift & Dr. Joshua titles, workbook titles, course descriptions, partner-row label, social URLs, real domain for sitemap/robots).

- [ ] **Step 5: Commit**

```bash
git add docs/REBUILD-SUMMARY.md
git commit -m "docs: rebuild summary, verification results, and client-input checklist"
```

---

## Self-Review

**Spec coverage:** Tasks map to spec — global elements (T4), home sections (T6), about (T7), services overview (T8), 5 service pages (T9–T11), contact (T12), appointment (T13), SEO (T14), images/manifest (T15), verification + deliverable summary (T16). Mental-health rehab omission + Epignosis prohibition (T10), First Aid Coming Soon (T11), WhatsApp forms (T5/T12/T13), clean URLs (T1), social-icon removal (T4), Fast Response Time fix (T6 §4). Covered.

**Placeholder scan:** Intentional `NEEDS CLIENT INPUT` markers are in-page HTML comments and consolidated in T16 — these are deliverables, not plan gaps. Domain in robots/sitemap flagged as replace-before-launch. No "TODO/TBD" left in build code.

**Type consistency:** JS hooks (`form[data-wa]`, `data-wa-intro`, `data-label`, `.form-success`, `.step`, `.reveal`, `.nav-toggle`, `#primary-nav`, `[data-year]`, `.scroll-top`) defined in T5 match usage in T4/T6/T11/T12/T13. CSS class names consistent between T2–T4 and page tasks.
