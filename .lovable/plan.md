## Fix inaccurate "No cookies" badge

The hero/header `PrivacyBadge` still reads **"No tracking · No cookies"** (EN) / **"Sin tracking · Sin cookies"** (ES). That contradicts the new `/cookies` page, which honestly discloses three strictly-necessary infrastructure cookies.

### Change

In `src/i18n/dictionary.ts`, update the `privacy.short` key:

- EN: `No tracking · No cookies` → **`No tracking · Only essential cookies`**
- ES: `Sin tracking · Sin cookies` → **`Sin tracking · Solo cookies esenciales`**

Also tighten `privacy.long` so the popover matches the new wording (it currently claims "This site stores nothing about you"):

- EN: **`No analytics, no ads, no first-party tracking. The only cookies set are strictly-necessary ones from our hosting and CDN — see the details below.`**
- ES: **`Sin analítica, sin publicidad, sin rastreo de primera parte. Las únicas cookies que se guardan son estrictamente necesarias de nuestro hosting y CDN — mira el detalle abajo.`**

The popover already links to `/cookies` via the `privacy.viewCookies` key added previously, so users can jump straight to the full disclosure.

### Out of scope

No component or layout changes — `PrivacyBadge` already reads these keys.
