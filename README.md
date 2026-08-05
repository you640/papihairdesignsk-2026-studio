# PAPI Hair DESIGN Studio (Next.js PWA)

---

## PWA Theme Color Compatibility

> Poznámka: Meta tag `<meta name="theme-color" ...>` je podporovaný v Chrome/Edge a väčšine Android prehliadačov. Firefox, Opera a Firefox for Android tento tag ignorujú. Pre maximálnu kompatibilitu je fallback farba nastavená v CSS na `<body>`.

This is a modern, installable Progressive Web App (PWA) for PAPI Hair DESIGN Studio, built with Next.js, Firebase, and ShadCN UI.

The logo used in the application header is a default logo provided for the project.

---

## Setup & Environment Variables

Firebase configuration is read from environment variables (see `src/firebase/config.ts`). **The production build fails without them** (prerendering throws `auth/invalid-api-key`), so define them in `.env.local` (or in Vercel/Firebase App Hosting project settings):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=        # optional
NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY=   # optional, for push notifications
```

Install dependencies with `npm install --legacy-peer-deps` (there is a peer-dependency conflict: `@genkit-ai/next` requires Next 15 while the project uses Next 16). Then:

- `npm run dev` – dev server on port **9003**
- `npm run build` – production build
- `npm run typecheck` – TypeScript check

---

## Visual Style and Design Specification


This section serves as a technical manual for the application's visual identity, detailing the design tokens, animations, and component styles.

### 1. Design Tokens


#### 1.1. Color Palette


The color scheme is defined as CSS variables in `src/app/globals.css`. Both a light (`:root`, default) and a dark (`.dark`) theme are defined; the app is "dark-first" because `AppProvider` defaults the theme to `dark` (persisted in `localStorage`). The table below documents the **dark theme** values:

| Token | HSL Variable | Hex | Description |
| :--- | :--- | :--- | :--- |
| **Background** | `--background` | `#101010` | Main app background (brand-dark). |
| **Foreground** | `--foreground` | `#F0F0F0` | Main text color (brand-light). |
| **Card** | `--card` | `#1A1A1A` | Background for cards, header, footer. |
| **Primary** | `--primary` | `#D4AF37` | Main accent for buttons, links, rings (brand-gold). |
| **Primary Fg** | `--primary-foreground`| `#121212` | Text on primary buttons. |
| **Secondary** | `--secondary` | `#1A1A1A` | Secondary component background. |
| **Secondary Fg**| `--secondary-foreground`| `#D4AF37` | Text on secondary components. |
| **Muted** | `--muted` | `#575761` | Muted elements background. |
| **Muted Fg** | `--muted-foreground` | `#D1D5DB` | Muted text color. |
| **Accent** | `--accent` | `#424252` | Background for hover states. |
| **Destructive** | `--destructive` | `#DC2626` | Destructive actions (errors, delete). |
| **Border** | `--border` | `hsla(45,63%,52%,0.2)` | Borders on cards, inputs. |
| **Input** | `--input` | `hsla(45,63%,52%,0.3)` | Input field borders. |
| **Ring** | `--ring` | `#D4AF37` | Focus ring color. |

#### 1.2. Typography


Two primary fonts are used, configured in `src/app/layout.tsx` (Inter via `next/font`) and `src/app/globals.css` (General Sans via Fontshare import), and applied in `tailwind.config.ts`.

- **Headline Font:** `General Sans` (sans-serif) - Used for all headings (`font-headline`).
- **Body Font:** `Inter` (sans-serif) - Used for all body text (`font-body`).

### 2. Animation Library (Visual Physics)


Animations are handled primarily by **Framer Motion** and **Tailwind CSS keyframes**.

- **Page Transitions:** A soft fade-and-slide effect (`PageTransition.tsx`) is applied on route changes.
  - **Physics:** `opacity: 0 -> 1`, `translateY: 10px -> 0` (tween, ease `anticipate`). Duration: `500ms`.
- **Button Effects (`PhdButton.tsx`):**
  - **Hover:** A subtle lift (`-translate-y-0.5`, tj. -2px) and a background/shadow change (`hover:bg-brand-gold-hover`, `hover:shadow-button-hover`).
  - **Click:** A press effect via `active:scale-95` (CSS transition, no Framer Motion ripple).
- **Hero Content Stagger:** Elements in the hero section fade and slide in sequentially.
  - **Delay:** `500ms` initial delay, `300ms` between child elements.
- **Image Hover Zoom:** Gallery and stylist images smoothly scale up to `1.05` on hover. This is configured in `tailwind.config.ts` and applied with `group-hover:scale-105`.

### 3. Key Component Styling


- **Header (`header.tsx`):**
  - `position: sticky`, `top: 0`, `z-index: 40`.
  - `height: 5rem`.
  - `background-color: var(--brand-secondary)`.
  - `border-bottom: 1px solid rgba(255, 255, 255, 0.1)` (`border-white/10`).

- **Admin Sidebar (`admin/layout.tsx`):**
  - `width: 16rem` (`w-64`).
  - `background-color: hsl(var(--card))` (`bg-card`).
  - Active Link Style: `bg-primary/10`, `text-primary`, `border-r-4 border-primary`.

- **Footer (`footer.tsx`):**
  - `background-color: var(--brand-secondary)`.
  - Subtle "aurora" effect using a `radial-gradient`.

- **Cards, Modals, Inputs:**
  - Styled consistently using the color tokens defined above. `border-primary/20` or `border-primary/30` is used for borders to maintain a cohesive look.
  - Focus states consistently use `ring-primary` for a clear visual cue.

- **Interactive Pricelist (`/cennik`):**
  - Implemented in `src/app/cennik/wp-cennik.tsx` as a client component.
  - Data Source: Services are fetched live (via SWR) from an external WordPress API (`https://api.all4all.sk/wp-json/query/services/`).
  - Features: full-text search, category/subcategory filters, price and duration range sliders (`rc-slider`), multi-sort, CSV export (`react-csv`), PDF export (`jspdf`) and a booking link to Bookio.
  - Note: `src/lib/pricelist-data.ts` contains a static copy of the pricelist (with `lucide-react` category icons), but it is currently not imported by any page — the live API is the source of truth. The full static pricelist is documented below.

---

## Kompletný Cenník Služieb


### DÁMSKY CENNÍK


#### Strihy a styling

- **Strih:** od 30 € *(umytie, strihanie, styling, trvanie: 1 h)*
- **Finálny styling:** od 20 € *(úprava účesu na konkrétnu príležitosť, trvanie: 30 min.)*
- **Spoločenský účes:** 40 € *(detailný styling na spoločenské udalosti, trvanie: 1 h)*
- **Fúkaná (polodlhé vlasy):** 20 € *(trvanie: 30 min.)*
- **Fúkaná (dlhé vlasy):** 30 € *(trvanie: 1 h)*


#### Copríky a špeciálne účesy

- **Copíky / braids:** od 30 € *(komplexné pletenie a styling, trvanie: 4 h)*


#### Ošetrenie a keratín

- **Brazílsky keratín:** od 130 € *(hlboká regenerácia a vyhladenie vlasov, trvanie: 3 h)*
- **Methamorphyc exclusive:** 50 € *(exkluzívna kúra s intenzívnou starostlivosťou, trvanie: 1 h 30 min.)*
- **Methamorphyc quick:** od 35 € *(rýchla regenerácia a lesk vlasov, trvanie: 1 h)*


#### Farbenie a odlesky

- **Farbenie (celé vlasy):** 70 € *(trvanie: 2 h)*
- **Farbenie (odrasty):** 45 € *(trvanie: 1 h 30 min.)*
- **Farbenie + strih (celé vlasy):** 90 € *(trvanie: 2 h)*
- **Farbenie + strih (odrasty):** 60 € *(trvanie: 2 h)*
- **Zosvetľovanie / gumovanie farby:** od 160 € *(trvanie: 4 h)*
- **Čistenie odleskov:** od 100 € *(trvanie: 3 h)*


#### Melíry a balayage

- **Melír (odrasty):** od 120 € *(trvanie: 3 h)*
- **Melír (celé vlasy):** od 150 € *(trvanie: 4 h)*
- **Balayage (doplnenie odrastov):** od 120 € *(trvanie: 3 h)*
- **Balayage (celé vlasy):** od 150 € *(trvanie: 4 h)*
- **Airtouch (doplnenie odrastov):** od 140 € *(trvanie: 4 h)*
- **Airtouch (celé vlasy):** od 170 € *(trvanie: 5 h)*


#### Predlžovanie vlasov

- **Napojenie TAPE IN:** od 40 € *(trvanie: 1 h)*
- **Prepojenie TAPE IN:** od 120 € *(trvanie: 2 h 30 min.)*


---

### PÁNSKY CENNÍK


#### Strihy a úprava vlasov

- **Pánsky strih:** 19 €
- **Junior strih:** 15 €
- **Vlasy + brada:** 27 €
- **Pánsky špeciál:** 50 €


#### Brada a fúzy

- **Úprava brady:** 12 €
- **Farbenie brady:** 10 €


#### Farbenie a špeciálne techniky

- **Tónovanie šedín:** 10 € *(trvanie: 30 min.)*
- **Zosvetľovanie vlasov:** 40 € *(trvanie: 1 h 30 min.)*
- **Trvalá ondulácia:** 40 € *(trvanie: 1 h 30 min.)*


#### Wellness & starostlivosť

- **Depilácia nosa:** 5 € *(trvanie: 10 min.)*
- **Depilácia uší:** 5 € *(trvanie: 10 min.)*
- **Peeling / čierna maska:** 10 € *(trvanie: 25 min.)*
- **Ušné sviečky:** 10 € *(trvanie: 20 min.)*

