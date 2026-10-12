# OMNAMHAPROPERTIES

Website for OMNAMHAPROPERTIES — real estate and property consultants in South Delhi.

A static site (HTML, CSS and vanilla JavaScript) with no build step. Open `index.html` in a browser, or view it on GitHub Pages.

## Editing content

All business details live in [`js/data.js`](js/data.js):

- **Contact** — phone, WhatsApp, email and social links (`SITE`)
- **Listings** — `PROPERTIES` (title, price, size, parking, highlights)
- **Reviews & testimonials** — `REVIEWS`, `TESTIMONIALS`
- **Blog teasers** — `BLOGS`

## Photos & videos

Each listing's photos live in `images/properties/<id>/` as `NN-sm.webp` (cards) and
`NN-lg.webp` (gallery), with optional video tours in `videos/<id>.mp4`.
[`js/media.js`](js/media.js) lists them per listing `id`, in display order — the first
photo is the cover.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and icon sprite |
| `css/style.css` | All styles, including the footer parallax reveal |
| `js/main.js` | Carousels, featured slider, photo gallery, listing filters, favourites, compare, modals |
| `js/data.js` | Site content |
| `js/media.js` | Photo and video list for each listing |
