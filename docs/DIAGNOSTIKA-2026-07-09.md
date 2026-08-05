# Kompletná diagnostika projektu — 9. 7. 2026

Diagnostika bola vykonaná na čistom klone repozitára (Node 22, npm 10). Zahŕňa inštaláciu závislostí, typecheck, lint, produkčný build a krížovú kontrolu dokumentácie (`README.md`, `docs/blueprint.md`) voči skutočnému kódu.

---

## 1. Výsledky technickej diagnostiky

| Krok | Výsledok | Poznámka |
| :--- | :--- | :--- |
| `npm ci` | ❌ **ZLYHÁVA** | Konflikt peer dependencies (viď 1.1) |
| `npm install --legacy-peer-deps` | ✅ OK | 1296 balíkov |
| `npm run typecheck` (`tsc --noEmit`) | ✅ OK | 0 chýb |
| `npm run lint` | ❌ **ZLYHÁVA** | `next lint` bol odstránený v Next 16 (viď 1.2) |
| `npm run build` (bez env) | ❌ **ZLYHÁVA** | `auth/invalid-api-key` pri prerenderi (viď 1.3) |
| `npm run build` (s Firebase env) | ✅ OK | 23 stránok, kompilácia ~15 s |

### 1.1 `npm ci` — konflikt závislostí (KRITICKÉ pre CI/CD)

`@genkit-ai/next@1.22.0` vyžaduje `next@^15.0.0`, ale projekt používa `next@16.0.10`:

```
npm error Conflicting peer dependency: next@15.5.20
npm error   peer next@"^15.0.0" from @genkit-ai/next@1.22.0
```

Čistá inštalácia funguje len s `--legacy-peer-deps`. **Dôsledok:** každý build systém, ktorý spúšťa štandardné `npm ci`/`npm install` (Vercel, Firebase App Hosting, GitHub Actions), zlyhá, pokiaľ nemá nastavený legacy režim.

**Odporúčanie:** buď odstrániť `@genkit-ai/next` + `genkit` (v kóde sa reálne nepoužívajú — `src/ai/` obsahuje len prázdny scaffold `genkit.ts` a `dev.ts`, žiadny flow sa nikde nevolá), alebo počkať na verziu kompatibilnú s Next 16 a dovtedy pridať `.npmrc` s `legacy-peer-deps=true`.

### 1.2 `npm run lint` — nefunkčný skript

```
Invalid project directory provided, no such directory: .../lint
```

Príkaz `next lint` bol v Next.js 16 odstránený. Projekt navyše nemá žiadnu ESLint konfiguráciu (`.eslintrc*` / `eslint.config.*` neexistuje) a ESLint nie je v devDependencies.

**Odporúčanie:** nainštalovať `eslint` + `eslint-config-next` a zmeniť skript na `eslint .`.

### 1.3 Build vyžaduje Firebase env premenné

`src/firebase/config.ts` číta `NEXT_PUBLIC_FIREBASE_*` z prostredia. Bez nich padá už prerender stránky `/_not-found` na `FirebaseError: auth/invalid-api-key`, pretože Firebase sa inicializuje na module-level a ťahá sa aj do statických stránok. Zoznam premenných je teraz zdokumentovaný v README (sekcia *Setup & Environment Variables*).

### 1.4 `NEXT_FORCE_WEBPACK=1` nefunguje

Skripty `dev`/`build` nastavujú `NEXT_FORCE_WEBPACK=1`, ale build log ukazuje `▲ Next.js 16.0.10 (Turbopack)` — Next 16 túto premennú ignoruje a beží na Turbopacku. Ak je webpack naozaj potrebný, správny prepínač je `next build --webpack`; inak premennú zo skriptov odstrániť (je to mŕtvy kód).

### 1.5 Duplicitné konfiguračné súbory

- **`next.config.js` aj `next.config.ts` existujú súčasne.** Next.js použije `.js` a `.ts` úplne ignoruje. `next.config.ts` navyše obsahuje zastaraný `experimental.turbo`. → Jeden z nich zmazať (odporúčam ponechať `.js`, ktorý je aktívny, alebo obsah zlúčiť do jedného).
- **Dva PWA balíky naraz:** `next-pwa@5` aj `@ducanh2912/next-pwa@10` sú v dependencies, ale **ani jeden nie je zapojený** v aktívnom `next.config.js`. Service worker sa teda pri builde negeneruje.

### 1.6 PWA je nefunkčná (napriek názvu projektu „Next.js PWA")

- `public/manifest.json` odkazuje na ikony `/icons/icon-192.png` a `/icons/icon-512.png`, ktoré **v repozitári neexistujú** (`public/` neobsahuje žiadny PNG). Chrome bez validných ikon inštaláciu PWA neponúkne.
- `public/sw.js`, `workbox-f1770938.js` a `fallback-*.js` sú **staré commitnuté build artefakty** — v kóde nie je žiadna registrácia service workera (`navigator.serviceWorker.register` sa v `src/` nenachádza) a PWA plugin nie je zapojený.
- Nekonzistentné theme farby: `<meta name="theme-color" content="#D4AF37">` (zlatá) vs. `"theme_color": "#111111"` v manifeste.
- `body { background-color: #D4AF37; }` v `globals.css` — zlatý fallback spôsobí zlatý záblesk pri načítaní na pomalom pripojení; pravdepodobne mal byť tmavý.

### 1.7 i18n je len čiastočne zapojené

- Build vypisuje `react-i18next:: You will need to pass in an i18next instance` — `wp-cennik.tsx` používa `useTranslation` z `next-i18next`, ktorý je určený pre Pages Router a v App Routri nie je inicializovaný. Texty fungujú len vďaka fallback parametrom `t('key', 'fallback')`.
- Adresár `src/app/[lang]/` obsahuje **iba prázdny layout** — žiadne stránky pod ním nie sú, takže jazykový routing reálne neexistuje. Slovníky `src/dictionaries/{sk,en}.json` sa načítavajú cez `getDictionary()` v root layoute.
- V projekte sú súčasne 3 i18n knižnice: `i18next`, `react-i18next`, `next-i18next` + vlastné dictionaries — treba zvoliť jeden prístup.

### 1.8 Ďalšie nálezy (poriadok v repe)

- `chromewebdata_2025-11-08_*.report.html/json` — Lighthouse reporty (~930 kB) commitnuté v roote; patria do `.gitignore`.
- `rc-slider.css` existuje duplicitne v roote **aj** v `src/` (importuje sa `@/rc-slider.css`, teda `src/` verzia; root verzia je mŕtva).
- `.modified` — prázdny súbor bez účelu.
- `react-beautiful-dnd` je oficiálne deprecated (upozornenie pri inštalácii); náhrada: `@hello-pangea/dnd`.
- `caniuse-lite`/`baseline-browser-mapping` sú ~7 mesiacov staré (`npx update-browserslist-db@latest`).
- Žiadne `.env*` súbory nie sú commitnuté ✅ a `.gitignore` ich správne vylučuje ✅.
- Firestore rules (`firestore.rules`) existujú a sú verzované ✅ (hĺbková bezpečnostná revízia pravidiel nebola súčasťou tejto diagnostiky).

---

## 2. Kontrola dokumentácie voči kódu („či všetko sedí")

### 2.1 README.md — nájdené a OPRAVENÉ nezrovnalosti

| # | Tvrdenie v README | Skutočnosť v kóde | Stav |
| :--- | :--- | :--- | :--- |
| 1 | Cenník: rozbitý riadok `- **Fúkaná (` a chýbajúca položka | `pricelist-data.ts` má „Fúkaná (polodlhé vlasy)" 20 €/30 min. | ✅ opravené |
| 2 | Headline font `Playfair Display`, konfigurovaný v `src/app/[lang]/layout.tsx` | Playfair sa v kóde **vôbec nevyskytuje**; headline je `General Sans` (Fontshare), body `Inter`; konfigurácia je v `src/app/layout.tsx` + `globals.css` | ✅ opravené |
| 3 | Page transition: `400ms`, `translateY: 1vh` | `PageTransition.tsx`: `500ms`, `y: 10px`, ease `anticipate` | ✅ opravené |
| 4 | `PhdButton`: „Click Ripple animovaný Framer Motion" | Žiadny ripple neexistuje — tlačidlo je čisté CSS (`active:scale-95`), Framer Motion sa v ňom nepoužíva | ✅ opravené |
| 5 | `/cennik`: „ShadCN Tabs + Accordion, dáta z `src/lib/pricelist-data.ts`" | Stránka používa `wp-cennik.tsx` — dáta ťahá live z WordPress API `api.all4all.sk`; `pricelist-data.ts` **nie je nikde importovaný** (mŕtvy kód / statická záloha) | ✅ opravené |
| 6 | Header border: `hsla(45, 63%, 52%, 0.2)` (zlatý) | Skutočnosť: `border-white/10` | ✅ opravené |
| 7 | Admin sidebar: `background: var(--brand-secondary)` | Skutočnosť: `bg-card` | ✅ opravené |
| 8 | Farebné tokeny „dark-first" | `:root` je default **svetlá** téma, `.dark` trieda nesie hodnoty z tabuľky; dark-first platí len vďaka defaultu `'dark'` v `AppProvider` | ✅ spresnené |
| 9 | Chýbala dokumentácia env premenných a inštalácie | Build bez `NEXT_PUBLIC_FIREBASE_*` zlyháva; `npm ci` vyžaduje `--legacy-peer-deps` | ✅ doplnená sekcia *Setup & Environment Variables* |

**Čo sedelo na chlp ✅:** celý zvyšok cenníka (všetkých 31 položiek, ceny aj trvania, 1:1 s `pricelist-data.ts`), farebná tabuľka voči `.dark` tokenom v `globals.css`, header (`sticky top-0 z-40 h-20 bg-brand-secondary`), aktívny link v admin sidebari (`bg-primary/10 text-primary border-r-4 border-primary`), šírka sidebaru (`w-64` = 16 rem), footer „aurora" radial-gradient, hover zoom galérie (`group-hover:scale-105`), poznámka o `theme-color` kompatibilite.

### 2.2 docs/blueprint.md — zastaraný dizajnový dokument

`blueprint.md` je pôvodné zadanie z Firebase Studio a **nesedí s finálnou aplikáciou**:

- Farby: koralová `#FF7F50` + béžová `#F5F5DC` → finálny dizajn je tmavý `#101010` + zlatá `#D4AF37`.
- Fonty: „Playfair + PT Sans" → skutočnosť je General Sans + Inter.
- Funkcie: „Online Shop s košíkom a checkoutom" a „Loyalty Program" — stránka `/obchod` existuje, ale plný e-commerce flow a vernostný program v kóde nie sú kompletné.

Dokument som ponechal bez zmeny ako historický artefakt — odporúčam ho buď označiť hlavičkou „pôvodný návrh, neaktuálne", alebo zmazať.

---

## 3. Prioritizované odporúčania

1. **[Vysoká]** Vyriešiť `npm ci` konflikt (odstrániť nepoužívaný Genkit alebo pridať `.npmrc` s `legacy-peer-deps=true`) — inak CI/CD buildy zlyhávajú.
2. **[Vysoká]** Opraviť lint: nainštalovať ESLint + `eslint-config-next`, zmeniť skript (Next 16 už `next lint` nemá).
3. **[Vysoká]** Dodať PWA ikony (`public/icons/icon-192.png`, `icon-512.png`) a rozhodnúť o PWA stratégii: zapojiť jeden PWA plugin a odstrániť druhý + staré `sw.js`/workbox artefakty.
4. **[Stredná]** Zmazať `next.config.ts` (ignorovaný duplikát) a `NEXT_FORCE_WEBPACK` zo skriptov.
5. **[Stredná]** Zjednotiť i18n na jeden prístup (dictionaries v App Routri) a odstrániť `next-i18next`.
6. **[Nízka]** Upratať repo: Lighthouse reporty, `.modified`, duplicitný `rc-slider.css` v roote, deprecated `react-beautiful-dnd`.
