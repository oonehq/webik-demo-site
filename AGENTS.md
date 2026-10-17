# Demo website editing contract

This is a website edited by the Webik local harness (manifest: webik.json). The editor itself lives outside this directory.

- Modify only this website's app/, components/, content/, lib/ and public/ files.
- Business facts (name, kind, description, phone, e-mail, address, opening hours with exceptions and holidays, branches, team, social links) live only in content/business.ts; lib/business.ts describes the fields and formats them. Pages, metadata and JSON-LD read the facts from there.
  - Change a fact only in content/business.ts, so one request updates every place where it appears. Never hard-code a fact in a page; if you find one, make it read from content/business.ts.
  - Optional fields that are missing are not shown. Add one only with a value the user gave; the contact section, footer and JSON-LD then show it.
  - Keep content/business.ts plain data (strings, numbers, arrays, objects; no expressions or spreads). The editor reads it to show the current facts and what changed.
  - Never invent or complete contact details, opening hours, prices or names, not even as placeholders. If the new value is missing or ambiguous, change nothing and ask the user.
- Search and sharing metadata (page title, description for search results, the website address, the share image) live only in content/seo.ts; lib/seo.ts describes the fields and builds the metadata, robots.txt, sitemap and JSON-LD links from it.
  - Change them only in content/seo.ts and keep it plain data. Do not set titles, descriptions, Open Graph tags, canonical links or robots rules anywhere else.
  - Write the title (about 50–60 characters) and description (about 120–160 characters) in natural Czech from what the website really says. No keyword stuffing, no invented claims, superlatives, reviews, prices, places or services.
  - Set siteUrl only to an address the owner gave ("https://example.cz", scheme and host only). Never invent or guess a domain. Without siteUrl the website deliberately sends no canonical link, share image or sitemap entries.
  - For the share image use an image the user attached (shareImage.url "/uploads/…", with a factual Czech alt). Without one, app/share-image.png/route.tsx generates an image with the business name; never use stock or made-up photos.
- Keep Next.js App Router and existing styling; use Base UI components for interactive controls.
- Preserve `<WebikInspector />` from @oonehq/webik-site-kit in app/layout.tsx and the data-webik-id attributes used for element selection. Give new sections and elements a stable, descriptive data-webik-id directly on the JSX element (lowercase letters, digits and hyphens, unique on the page). Do not copy the inspector into the website or add own listeners for webik:* messages.
- Images the user attaches in the editor are saved in public/uploads/ and served as /uploads/<file>. Use them by that URL; do not rename, move or delete them unless asked.
- Keep good desktop and mobile layouts, semantic markup and useful alternative text.
- Do not change package.json, the lockfile, .npmrc, next.config.ts, tsconfig.json, .gitignore or webik.json, and do not install dependencies. Those are developer changes outside the harness.
- Do not commit, push, deploy, start servers, contact people, or create subagents. Git actions belong to the editor UI.
- Run npm run typecheck before finishing. Summarize the change in Czech.
- Nerd Pottery, its team and all business details are demo fixtures, not factual claims about a real business.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
