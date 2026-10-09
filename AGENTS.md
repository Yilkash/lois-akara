# AGENTS.md

Notes for whoever works on this app next, human or AI agent (Claude, Codex, Cursor, …). Read README.md for what it does.

The shop's brand is **Mai Kosai** ("Northern Roots. Unforgettable Taste."), renamed from Lois Akara on 2026-10-09. The repo, URL and storage keys keep the old `lois-akara` / `loisAkara.*` names on purpose: changing them would make her reinstall and lose saved data.

## Shape

- Everything is in `index.html`, with inline CSS and JS and no build step. Also present:
  - `sw.js`: offline, network-first.
  - `manifest.webmanifest`.
  - `icon-192.png` and `icon-512.png`: her Mai Kosai logo on cream. Made from a screenshot (no original file exists).
  - `logo.png`: the round logo shown on the home header.
- Hosted on GitHub Pages from `main` of `Yilkash/lois-akara`. A push deploys in about a minute.
- There is no backend. Everything lives in the phone's `localStorage`:
  - `loisAkara.orders`: an array of `{id, day: "YYYY-MM-DD", no, at, name, items:[{id,name,qty,price,cost,for?}], total, pay: cash|transfer|unpaid, status: waiting|ready|done, cancelled?, doneAt?}`.
  - `loisAkara.settings`: `{shop, bank:{name,bank,number}, items:[{id,price}]}`. Item names and units come from `DEFAULTS` in code; only prices are kept from storage.
  - `loisAkara.draft`: the order being built: `{cart: [{key, id, qty, for}], pay, name}`. The same item can be in the cart more than once (separate packs, e.g. two ₦500 akara, one "for Musa"). Drafts from before v15 stored `cart` as `{itemId: qty}`; they are converted on load.
  - `loisAkara.view` and `loisAkara.period`: the tab and Past-days period last opened.
  - `loisAkara.theme`: `dark` or `light`.
  - `loisAkara.look`: the colour style: `warm` (default, shown as "Mai Kosai": cream, deep brown and gold), `clean`, `green`, `orange`, `gold` or `pink`.
  - `loisAkara.photos`: her own item photos as small JPEG data URLs. Without them the app uses the SVG drawings in `ART`.
- **Never rename or reshape these keys without a migration.** The live app holds real sales on her phone, and an update must not lose them.
- The bank account number is never in the code. She types it in Settings.

## Rules

- **On every deploy, bump `CACHE` in `sw.js` and `APP_VERSION` in `index.html` together, to the same value.** The update banner compares them. If they differ, the banner never goes away; if they aren't bumped, phones keep the old version.
- Confirmations use the app's own `ask()` box. Never use `confirm()` or `alert()`; the owner explicitly asked for that.
- Keep the SVG drawings as the default pictures. Stock food photos were tried and rejected.
- Light mode is the default; dark mode is opt-in.
- Order numbers restart at #1 each day (`nextNumber`). Past days are read-only, except that any order can be deleted (with confirmation).
- The owner wants a plan described before anything is built.

## Deploy

Commit to `main` and push as the `Yilkash` GitHub account. Then confirm the new `CACHE` value is served at https://yilkash.github.io/lois-akara/sw.js.

## Testing

Test with Playwright at 390×844 against `file:///…/index.html` and then the live URL. Cover at least:
- ₦300 → 6 akara;
- ₦330 → 3 puff-puff + ₦30 change;
- a full order total;
- reload persistence;
- cancel, delete and collect-unpaid through the `ask()` box (no native dialogs);
- Past days totals with seeded orders on earlier days;
- the update banner.

To test the update banner, route `sw.js?check=…` to a higher version.

## Ideas not done yet

- Shorten "Paid cash" and "Paid transfer" in the Queue so they fit on one line.
- Customer self-ordering by QR. This would need a backend.
