## Goal

Add a `/cookies` page that transparently lists every cookie the site sets and why, then link it from the global footer. Bilingual (EN/ES) to match the rest of the app.

## Cookies inventory (from your screenshot)

All three are infrastructure cookies — none are analytics, advertising, or first-party tracking:

| Name | Set by | Purpose | Lifetime |
|---|---|---|---|
| `__cf_bm` | Cloudflare | Bot management — distinguishes humans from bots to protect the site | ~30 min |
| `__dplb` | DigitalOcean App Platform load balancer | Routes you to the same backend instance for a stable session | ~7 days |
| `session-id` | Lovable hosting | Anonymous request session id used by the platform | ~30 min |

All are **strictly necessary / functional** — required to serve the site safely. None require consent under GDPR/ePrivacy. No banner is needed; a transparent disclosure page is the right move.

Note: the hero "No tracking · No cookies" badge (`privacy.short`) becomes inaccurate. We should soften it to something like "No tracking · Only essential cookies" and link it to the new page.

## Plan

1. **New route `/cookies`** — add `src/pages/Cookies.tsx` and register it in `src/App.tsx` above the catch-all.
2. **Page content** — reuse the existing layout primitives (`container`, `ChapterHeading`, `Helmet` for SEO with `noindex` not needed — we want it indexed). Sections:
   - Short intro: "We don't run analytics, ads, or first-party tracking. The cookies below come from the infrastructure that keeps the site online."
   - Table of the three cookies (Name / Provider / Purpose / Duration / Category).
   - "How to clear them" one-liner pointing to browser settings.
   - Contact line linking to your LinkedIn (matches the footer pattern).
3. **i18n** — add ~10 keys to `src/i18n/dictionary.ts` (`cookies.title`, `cookies.lead`, column headers, per-cookie purpose strings) so the page works in EN/ES.
4. **Footer link** — in `src/pages/Index.tsx` footer, add a `<Link to="/cookies">` next to the "Built by" line. Add `ft.cookies` translation key.
5. **Honesty fix** — update `privacy.short` from "No tracking · No cookies" to "No tracking · Only essential cookies" (EN) / "Sin tracking · Solo cookies esenciales" (ES), and make `PrivacyBadge`'s tooltip link to `/cookies`.
6. **Sitemap** — add `{ path: "/cookies", changefreq: "yearly", priority: "0.3" }` to `scripts/generate-sitemap.ts`.
7. **SEO** — `Helmet` with localized title ("Cookies — Privacy Atlas" / "Cookies — Privacy Atlas"), description, canonical `https://atlas.privacyengineering.cl/cookies`.

## Out of scope

- No consent banner (not legally required for strictly-necessary cookies).
- No cookie-blocking toggle (the cookies are set by upstream infra, not by app code — we can't programmatically suppress them).

Want me to proceed?
