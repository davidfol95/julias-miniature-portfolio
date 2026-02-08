# Julia Rosenbaum — Miniature Artist Portfolio

## Project Overview
Single-page portfolio website for Julia Rosenbaum, showcasing hand-sculpted miniature dioramas made from clay. Hosted on Vercel with domain at julia-rosenbaum.com.

## Tech Stack
- Vanilla HTML/CSS/JS (no build tools or bundlers)
- Google Fonts: Playfair Display (serif headings) + Inter (sans body)
- Images served as WebP format
- Hosted on Vercel, domain managed via Cloudflare

## File Structure
```
index.html              — HTML markup only
css/
  styles.css            — Entry point (@import chain)
  base.css              — CSS variables, reset, shared utilities
  layout.css            — Nav, hero, featured, about, contact, footer
  gallery.css           — Gallery grid, filters, lightbox
  responsive.css        — Media queries (900px, 600px breakpoints)
js/
  gallery-data.js       — Gallery content data (loads first)
  gallery.js            — DOM population, filtering, lightbox
  navigation.js         — Nav scroll effect, mobile menu
  effects.js            — Scroll reveal (IntersectionObserver)
  contact.js            — Form submit handler
images/                 — All images in WebP format
```

## Key Conventions
- Julia sculpts with clay — never refer to "painting" or "brushwork"
- Artist name: Julia Rosenbaum
- Gallery categories: Storefronts, Scenes, Details
- CSS loads via @import chain in styles.css (base → layout → gallery → responsive)
- JS loads with `defer` in dependency order: gallery-data → gallery → navigation → effects → contact
- gallery.js must load before effects.js (scroll reveal needs dynamically-created gallery items)

## Adding New Gallery Pieces
Edit `js/gallery-data.js` — add a new object to the array with:
- `title`, `category`, `description`, `scale`, `medium`, `time`
- `images`: array of image paths (supports multiple for lightbox)

## GitHub
Repository: https://github.com/davidfol95/julias-miniature-portfolio

## Deployment
- Vercel auto-deploys from the `main` branch on push
- When asked to commit, stage and commit changes but do NOT push unless explicitly asked
- Domain DNS is managed through Cloudflare (A record + CNAME pointing to Vercel)

## Image Workflow
- All images must be in WebP format before adding to the site
- Convert from JPEG/PNG: `cwebp -q 80 input.jpg -o images/output.webp`
- Convert from HEIC: first `sips -s format jpeg input.heic --out temp.jpg`, then convert the JPEG to WebP
- Check EXIF rotation — if an image appears rotated after conversion, use `sips -r [degrees]` on the source before converting
- Use descriptive kebab-case filenames (e.g., `corner-bakery.webp`, `grocery-store-hero.webp`)
