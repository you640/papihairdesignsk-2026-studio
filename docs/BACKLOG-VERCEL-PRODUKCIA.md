# BACKLOG — Prestavba na 100 % produkčnú Next.js verziu (Vercel)

Cieľ: stabilný, čistý Next.js 16 App Router projekt, ktorý prejde `npm ci` → `build` → deploy na Vercel bez jediného warningu, s funkčnou PWA, jednotným i18n a upratanou dokumentáciou.

Vychádza z diagnostiky `docs/DIAGNOSTIKA-2026-07-09.md`. Každá úloha má prioritu, akceptačné kritériá (AK) a pripravený **prompt**, ktorý stačí skopírovať agentovi/AI na vykonanie.

Poradie sprintov je záväzné — Sprint 1 odblokuje CI/CD, bez neho sa ostatné nedajú poriadne verifikovať.

---

## SPRINT 1 — Build & CI/CD odblokovanie (P0, blokuje všetko)

### 1.1 Vyriešiť `npm ci` konflikt závislostí
**Problém:** `@genkit-ai/next@1.22` vyžaduje `next@^15`, projekt má `next@16.0.10` → `npm ci` padá, Vercel build padne.
**Riešenie:** Genkit sa v kóde nepoužíva (v `src/ai/` je len prázdny scaffold) → odstrániť `genkit`, `@genkit-ai/next`, `@genkit-ai/google-genai`, `genkit-cli`, skripty `genkit:dev`/`genkit:watch` a adresár `src/ai/`.
**AK:** `rm -rf node_modules package-lock.json && npm install && npm ci` prejde bez `--legacy-peer-deps` a bez ERESOLVE.

> **PROMPT:** „Odstráň z projektu všetky Genkit závislosti (genkit, @genkit-ai/next, @genkit-ai/google-genai, genkit-cli), skripty genkit:dev a genkit:watch z package.json a adresár src/ai. Over, že sa Genkit nikde neimportuje. Potom pregeneruj package-lock.json čistým `npm install` (bez legacy-peer-deps) a over, že `npm ci`, `npm run typecheck` aj `npm run build` prejdú."

### 1.2 Opraviť lint
**Problém:** `next lint` v Next 16 neexistuje; ESLint nie je nainštalovaný, žiadna konfigurácia.
**AK:** `npm run lint` beží ESLint flat config s `eslint-config-next`, 0 errorov (warningy povolené v prvej iterácii).

> **PROMPT:** „Nainštaluj eslint@9 a eslint-config-next ako devDependencies, vytvor eslint.config.mjs (flat config) s next/core-web-vitals, zmeň skript lint na `eslint .` a oprav všetky ERROR-level nálezy. Warningy vypíš do zoznamu, neopravuj ich zatiaľ."

### 1.3 Zjednotiť next config
**Problém:** `next.config.js` (aktívny) + `next.config.ts` (ignorovaný, so zastaraným `experimental.turbo`) existujú súčasne; `NEXT_FORCE_WEBPACK=1` v skriptoch nič nerobí (build beží na Turbopacku).
**AK:** existuje len jeden config; skripty bez mŕtvych env premenných; build stále prechádza.

> **PROMPT:** „Zmaž next.config.ts, ponechaj next.config.js ako jediný zdroj pravdy. Odstráň NEXT_FORCE_WEBPACK=1 zo skriptov dev/build/vercel-build v package.json. Over build."

### 1.4 Env premenné pre Vercel
**Problém:** build vyžaduje `NEXT_PUBLIC_FIREBASE_*`; blok `env:` v next.config.js je redundantný (NEXT_PUBLIC_ sa inlinuje automaticky).
**AK:** `.env.example` v repe; `env:` blok odstránený; README sekcia Setup aktuálna; premenné nastavené vo Vercel projekte (Production + Preview).

> **PROMPT:** „Vytvor .env.example so všetkými NEXT_PUBLIC_FIREBASE_* premennými (bez hodnôt), odstráň redundantný env: blok z next.config.js a over, že build s .env.local stále prejde. Do README doplň odkaz na .env.example."

### 1.5 Vercel smoke deploy
**AK:** Preview deploy na Verceli zelený, všetkých 23 stránok sa vyrenderuje, žiadna runtime error v logoch.

> **PROMPT:** „Nasaď aktuálnu vetvu ako Vercel preview, skontroluj build log na warningy a runtime logy na chyby. Prejdi /, /cennik, /obchod, /booking, /admin a /blog a nahlás všetko, čo je rozbité."

---

## SPRINT 2 — PWA sfunkčnenie (P1)

### 2.1 Ikony a manifest
**Problém:** manifest odkazuje na neexistujúce `/icons/icon-192.png`, `icon-512.png` → Chrome install prompt sa nikdy nezobrazí. Nekonzistentné theme farby (meta `#D4AF37` vs manifest `#111111`) a zlatý `body { background-color: #D4AF37 }` fallback (zlatý záblesk pri načítaní).
**AK:** ikony 192/512 + maskable existujú; theme_color zjednotené na `#101010`; body fallback tmavý; Lighthouse PWA installability zelená.

> **PROMPT:** „Vygeneruj z loga PWA ikony 192x192, 512x512 a maskable variantu do public/icons/, uprav manifest.json (name, short_name, theme_color #101010, background_color #101010, purpose maskable), zjednoť meta theme-color v layout.tsx na #101010 a zmeň body background v globals.css z #D4AF37 na tmavú farbu pozadia. Over cez Lighthouse, že PWA je installable."

### 2.2 Service worker
**Problém:** dva PWA balíky v dependencies (`next-pwa@5`, `@ducanh2912/next-pwa@10`), ani jeden zapojený; `public/sw.js` + workbox súbory sú staré artefakty bez registrácie.
**AK:** jeden balík (odporúčam `@ducanh2912/next-pwa`, alternatívne `serwist`), zapojený v next.config.js, staré artefakty zmazané, SW sa registruje a offline fallback funguje. Pozor: overiť kompatibilitu s Next 16/Turbopack — ak `@ducanh2912/next-pwa` nepodporuje Next 16, použiť `@serwist/next`.

> **PROMPT:** „Odstráň next-pwa@5 z dependencies. Zapoj @ducanh2912/next-pwa (alebo @serwist/next, ak ducanh nepodporuje Next 16) do next.config.js s runtime cachingom pre statické assety a network-first pre API. Zmaž staré public/sw.js, workbox-*.js a fallback-*.js. Over, že sa SW registruje v produkčnom builde a funguje offline fallback. Nechaj firebase-messaging-sw.js nedotknutý."

### 2.3 Push notifikácie
**AK:** `firebase-messaging-sw.js` má aktuálny config, `PushNotificationManager` pýta permission až po user interakcii, VAPID kľúč v env.

> **PROMPT:** „Zreviduj push notifikačný flow: firebase-messaging-sw.js, src/firebase/messaging.ts a PushNotificationManager.tsx. Over, že permission prompt sa spúšťa až po kliknutí užívateľa, token sa ukladá do Firestore a NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY sa číta z env. Oprav, čo nesedí."

---

## SPRINT 3 — i18n zjednotenie (P1)

### 3.1 Jeden i18n prístup
**Problém:** 3 knižnice naraz (`i18next`, `react-i18next`, `next-i18next`) + vlastné dictionaries; `next-i18next` je pre Pages Router a v App Routri hádže `NO_I18NEXT_INSTANCE`; `src/app/[lang]/` je prázdny pahýľ bez stránok.
**AK:** jediný mechanizmus — vlastné dictionaries (`getDictionary`) všade; `next-i18next` a nepoužité knižnice odstránené; `[lang]` adresár buď plne funkčný routing, alebo zmazaný; build bez i18n warningov.

> **PROMPT:** „Zjednoť i18n: odstráň next-i18next (a i18next/react-i18next, ak sa po refaktore nikde nepoužívajú), prepíš useTranslation volania v src/app/cennik/wp-cennik.tsx (a všade inde) na náš dictionaries systém (getDictionary + AppProvider dictionary prop). Zmaž prázdny src/app/[lang]/ adresár. Over, že build nebehá s react-i18next warningom a /cennik má správne slovenské texty."

### 3.2 Kompletné preklady
**AK:** `sk.json` a `en.json` pokrývajú všetky hardcoded stringy; jazykový prepínač funguje (ak sa rozhodne pre EN verziu) alebo sa EN slovník odstráni.

> **PROMPT:** „Prejdi všetky komponenty a vytiahni hardcoded slovenské stringy do src/dictionaries/sk.json. Rozhodni podľa obsahu en.json, či je EN verzia reálne udržiavaná — ak je z 80 %+ prázdna/neaktuálna, navrhni jej odstránenie namiesto dopĺňania."

---

## SPRINT 4 — Upratanie repa a závislostí (P2)

### 4.1 Mŕtve súbory
**AK:** z repa zmiznú: `chromewebdata_2025-11-08_*.report.html/json` (~930 kB), `.modified`, duplicitný `rc-slider.css` v roote, `.idx/` (ak sa nepoužíva Firebase Studio); `.gitignore` doplnený o `*.report.html`, `*.report.json`.

> **PROMPT:** „Zmaž z repa Lighthouse reporty chromewebdata_*, prázdny súbor .modified, duplicitný rc-slider.css v roote (importuje sa src/rc-slider.css) a adresár .idx ak sa nepoužíva. Doplň .gitignore o *.report.html a *.report.json. Over build."

### 4.2 Deprecated a nekonzistentné závislosti
**AK:** `react-beautiful-dnd` → `@hello-pangea/dnd`; `@types/recharts` odstránený (recharts 2 má vlastné typy); `@next/bundle-analyzer` zosúladený s Next verziou; browserslist DB aktuálna.

> **PROMPT:** „Nahraď react-beautiful-dnd za @hello-pangea/dnd (API-kompatibilné, over drag&drop v admin sekcii), odstráň @types/recharts a @types/react-csv ak balíky majú vlastné typy, aktualizuj @next/bundle-analyzer na verziu zodpovedajúcu Next 16 a spusti npx update-browserslist-db@latest. Typecheck + build musia prejsť."

### 4.3 Mŕtvy kód
**AK:** `src/lib/pricelist-data.ts` — rozhodnúť: buď sa použije ako fallback pre /cennik pri výpadku API (odporúčané), alebo zmazať. Súbory `cennik/AdminAuth.tsx`, `AdminPanel.tsx`, `ReservationForm.tsx`, `admin-api.ts` preveriť, či sa importujú.

> **PROMPT:** „Preveri, ktoré súbory v src/app/cennik/ (AdminAuth, AdminPanel, ReservationForm, admin-api) sa reálne importujú. Nepoužívané zmaž. pricelist-data.ts zapoj ako statický fallback do wp-cennik.tsx — keď SWR fetch z api.all4all.sk zlyhá, zobraz statický cenník namiesto chybovej hlášky."

### 4.4 Rozhodnúť hosting stratégiu
**Problém:** v repe sú súčasne konfigurácie pre Vercel (`vercel.json`), Firebase Hosting (`firebase.json`) aj Firebase App Hosting (`apphosting.yaml`).
**AK:** cieľ je Vercel → `firebase.json` ponechať len pre Firestore rules deploy (odstrániť hosting blok), `apphosting.yaml` zmazať.

> **PROMPT:** „Cieľová platforma je Vercel. Uprav firebase.json tak, aby obsahoval len firestore rules konfiguráciu (pridaj blok firestore.rules), odstráň hosting blok a zmaž apphosting.yaml. Over, že vercel.json je korektný pre Next 16."

---

## SPRINT 5 — Kvalita, bezpečnosť, výkon (P2)

### 5.1 Bezpečnostný audit Firestore rules
**AK:** každá kolekcia má explicitné pravidlá; admin operácie viazané na custom claim alebo admin kolekciu; žiadne `allow read, write: if true`; pravidlá pokryté testami cez Firebase emulator.

> **PROMPT:** „Sprav bezpečnostný audit firestore.rules (11 kB): over, že bežný užívateľ nevie zapisovať do services/stylists/products/blog, že rezervácie vie čítať len ich vlastník a admin, a že admin rola sa overuje server-side (custom claims), nie client-side. Nahlás každé riziko s konkrétnym pravidlom a navrhni opravu."

### 5.2 Error handling a UX stavov
**AK:** root `error.tsx`, `not-found.tsx` a `loading.tsx` existujú; Firebase inicializácia neodpáli prerender (guard na chýbajúce env); /cennik má skeleton loading a error stav s retry.

> **PROMPT:** „Pridaj do src/app/ globálny error.tsx, not-found.tsx a loading.tsx v dizajne aplikácie (dark + gold). Do src/firebase/config.ts pridaj guard, ktorý pri chýbajúcich env premenných vyhodí zrozumiteľnú chybu s návodom namiesto auth/invalid-api-key. Do wp-cennik.tsx pridaj skeleton loader a error stav s retry tlačidlom."

### 5.3 Výkon a Core Web Vitals
**AK:** Lighthouse Performance ≥ 90 na mobile pre /, /cennik; `images.unoptimized` v produkcii vypnuté (Vercel má image optimizer!); fonty bez layout shiftu; bundle analyzer report bez balíkov > 150 kB v initial load.

> **PROMPT:** „Na Verceli netreba images.unoptimized — zapni Next image optimalizáciu v produkcii (odstráň unoptimized: isProd z next.config.js). Presuň General Sans z CSS @import (render-blocking) na next/font/local alebo preload link. Spusti npm run analyze a identifikuj najväčšie chunky — jspdf a react-csv načítaj dynamicky (next/dynamic) len na /cennik pri kliknutí na export. Zmeraj Lighthouse pred/po."

### 5.4 SEO
**AK:** metadata per-page (generateMetadata), OG obrázky, sitemap.xml a robots.txt aktuálne, JSON-LD schema validná (Rich Results Test).

> **PROMPT:** „Doplň generateMetadata s unikátnym title/description pre /cennik, /obchod, /onas, /booking, /blog a blog posty. Pridaj OG image. Over sitemap.xml a robots.txt routes, a zvaliduj JSON-LD HairSalon schemu v layout.tsx cez Rich Results Test — doplň openingHours z src/lib/openingHours.ts."

### 5.5 Testy a CI pipeline
**AK:** GitHub Actions workflow: `npm ci` → lint → typecheck → build na každý PR; aspoň smoke Playwright test (homepage + /cennik render).

> **PROMPT:** „Vytvor .github/workflows/ci.yml: Node 22, npm ci, lint, typecheck, build (s dummy NEXT_PUBLIC_FIREBASE_* env). Pridaj Playwright s dvoma smoke testami: homepage sa vyrenderuje s headerom a /cennik zobrazí aspoň jednu službu (mocknuté API). Nastav workflow ako required check."

---

## SPRINT 6 — Dokumentácia a odovzdanie (P3)

### 6.1 README finalizácia
**AK:** README obsahuje: quickstart, env setup, architektúru (App Router mapa routes), deploy postup na Vercel, PWA poznámky; cenník v README sa generuje/synchronizuje s pricelist-data.ts alebo sa odstráni (duplicita s live API).

> **PROMPT:** „Zreštrukturalizuj README.md: 1) Quickstart, 2) Env setup s odkazom na .env.example, 3) Mapa routes s popisom, 4) Deploy na Vercel krok za krokom, 5) Design systém (existujúca sekcia). Statický cenník presuň z README do docs/CENNIK.md s poznámkou, že zdroj pravdy je WordPress API."

### 6.2 blueprint.md
**AK:** označený ako historický dokument alebo zmazaný.

> **PROMPT:** „Pridaj na začiatok docs/blueprint.md upozornenie, že ide o pôvodný návrh z Firebase Studio a nezodpovedá finálnej implementácii (farby, fonty, rozsah funkcií) — s odkazom na README ako aktuálny zdroj pravdy."

---

## Definícia hotového (Definition of Done pre celý backlog)

- [ ] `npm ci && npm run lint && npm run typecheck && npm run build` — všetko zelené, bez warningov
- [ ] Vercel production deploy zelený, všetky routes fungujú
- [ ] Lighthouse: Performance ≥ 90, PWA installable, SEO ≥ 95, Accessibility ≥ 90 (mobile)
- [ ] `npm audit --omit=dev` bez high/critical
- [ ] Žiadny mŕtvy kód, žiadne duplicitné configy ani závislosti
- [ ] Firestore rules auditované a otestované
- [ ] CI pipeline na PR povinná
- [ ] README + docs zodpovedajú realite na chlp

## Odhad náročnosti

| Sprint | Rozsah | Odhad |
| :--- | :--- | :--- |
| 1 — Build & CI/CD | 5 úloh | 0,5–1 deň |
| 2 — PWA | 3 úlohy | 1 deň |
| 3 — i18n | 2 úlohy | 0,5–1 deň |
| 4 — Upratanie | 4 úlohy | 0,5 dňa |
| 5 — Kvalita/výkon | 5 úloh | 2–3 dni |
| 6 — Dokumentácia | 2 úlohy | 0,5 dňa |
| **Spolu** | **21 úloh** | **~5–7 dní** |
