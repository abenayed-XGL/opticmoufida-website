# Optique Moufida — website

Static website for **Optique Moufida**, optician in Ariana, Tunisia (since 1991).
Plain HTML, CSS and JavaScript. No build step, no framework, free to host.

## Pages

| File | URL |
|---|---|
| `index.html` | `/` |
| `collection.html` | `/collection` |
| `about.html` | `/about` |
| `contact.html` | `/contact` |
| `404.html` | any unknown URL (e.g. old Squarespace product links) |
| `address.html`, `cart.html` | redirect old Squarespace URLs to the new pages |

## Languages (French / English)

French is the default. Visitors switch with the **FR / EN** button; the choice is remembered.
English is picked automatically if the visitor's browser is in English. You can also link
directly to a language with `?lang=en` or `?lang=fr`.

**All text lives in `assets/js/i18n.js`** — edit the `fr` and `en` entries there.

## Common edits

- **Change text, hours, etc.** → `assets/js/i18n.js` (both languages).
- **Phone, email, address in links** → search and replace in the `.html` files.
- **Add a photo to the collection** → save it as `.webp` in `assets/img/`, then add a line in
  `assets/js/collection.js` (brand + category: `optical`, `sun` or `kids`).
- **Change the hero slideshow** → the `<div class="slideshow">` block in `index.html`.
- **Colours and fonts** → variables at the top of `assets/css/style.css`.

Preview locally: `python3 -m http.server` in this folder, then open http://localhost:8000/index.html.

## Hosting

### Option A — Cloudflare Pages (recommended)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Framework preset: **None**. Build command: *(empty)*. Output directory: `/`.
3. Custom domains → add `opticmoufida.com` and `www.opticmoufida.com`.

### Option B — GitHub Pages
1. Repo **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
2. Custom domain: `www.opticmoufida.com` (GitHub creates a `CNAME` file), tick *Enforce HTTPS*.
3. At the domain's DNS: `CNAME www → abenayed-xgl.github.io`, and A records for the apex
   `opticmoufida.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

Only cancel Squarespace once the new site works on the domain.

---
Brand names and campaign images belong to their respective owners.
