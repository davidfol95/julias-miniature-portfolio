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
index.html              — HTML markup + SEO metadata + JSON-LD structured data
favicon.svg             — SVG favicon (JR initials)
robots.txt              — Search engine crawling rules
sitemap.xml             — Sitemap for SEO
css/
  styles.css            — Single combined stylesheet (base + layout + gallery + responsive)
js/
  gallery-data.js       — Gallery content data (loads first)
  gallery.js            — DOM population, filtering, lightbox with focus trap
  navigation.js         — Nav scroll effect, mobile menu with hamburger animation
  effects.js            — Scroll reveal (IntersectionObserver)
  contact.js            — Form submit handler
images/                 — All images in WebP format (optimized, max 1400px wide)
```

## Key Conventions
- Julia sculpts with clay — never refer to "painting" or "brushwork"
- Artist name: Julia Rosenbaum
- Gallery categories: Storefronts, Scenes, Details
- CSS is a single combined file with section comments (base → layout → gallery → responsive → reduced motion)
- JS loads with `defer` in dependency order: gallery-data → gallery → navigation → effects → contact
- gallery.js must load before effects.js (scroll reveal needs dynamically-created gallery items)
- All images below the fold use `loading="lazy"`; hero uses `fetchpriority="high"`

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
- All images must be in WebP format, max 1400px wide, targeting 100-400 KB per image
- Convert from JPEG/PNG: `cwebp -q 75 input.jpg -o images/output.webp`
- Convert from HEIC: first `sips -s format jpeg input.heic --out temp.jpg`, then convert the JPEG to WebP
- Resize before converting: `sips -Z 1400 input.jpg` (resizes longest edge to 1400px)
- Check EXIF rotation — if an image appears rotated after conversion, use `sips -r [degrees]` on the source before converting
- Use descriptive kebab-case filenames (e.g., `corner-bakery.webp`, `grocery-store-hero.webp`)
