# PAPI Hair DESIGN Studio (Next.js PWA)

---

## PWA Theme Color Compatibility

> Poznámka: Meta tag `<meta name="theme-color" ...>` je podporovaný v Chrome/Edge a väčšine Android prehliadačov. Firefox, Opera a Firefox for Android tento tag ignorujú. Pre maximálnu kompatibilitu je fallback farba nastavená v CSS na `<body>`.

This is a modern, installable Progressive Web App (PWA) for PAPI Hair DESIGN Studio, built with Next.js, Firebase, and ShadCN UI.

The logo used in the application header is a default logo provided for the project.

---

## Visual Style and Design Specification


This section serves as a technical manual for the application's visual identity, detailing the design tokens, animations, and component styles.

### 1. Design Tokens


#### 1.1. Color Palette


The color scheme is defined as CSS variables in `src/app/globals.css` and is built for a "dark-first" experience.

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


Two primary fonts are used, configured in `src/app/[lang]/layout.tsx` and applied in `tailwind.config.ts`.

- **Headline Font:** `Playfair Display` (serif) - Used for all headings (`h1`-`h6`).
- **Body Font:** `Inter` (sans-serif) - Used for all body text.

### 2. Animation Library (Visual Physics)


Animations are handled primarily by **Framer Motion** and **Tailwind CSS keyframes**.

- **Page Transitions:** A soft fade-and-slide effect (`PageTransition.tsx`) is applied on route changes.
  - **Physics:** `opacity: 0 -> 1`, `translateY: 1vh -> 0`. Duration: `400ms`.
- **Button Effects (`PhdButton.tsx`):**
  - **Hover:** A subtle lift (`translateY(-2px)`) and a background color change.
  - **Click Ripple:** A ripple effect originates from the click point, animated with Framer Motion.
- **Hero Content Stagger:** Elements in the hero section fade and slide in sequentially.
  - **Delay:** `500ms` initial delay, `300ms` between child elements.
- **Image Hover Zoom:** Gallery and stylist images smoothly scale up to `1.05` on hover. This is configured in `tailwind.config.ts` and applied with `group-hover:scale-105`.

### 3. Key Component Styling


- **Header (`header.tsx`):**
  - `position: sticky`, `top: 0`, `z-index: 40`.
  - `height: 5rem`.
  - `background-color: var(--brand-secondary)`.
  - `border-bottom: 1px solid hsla(45, 63%, 52%, 0.2)`.

- **Admin Sidebar (`admin/layout.tsx`):**
  - `width: 16rem`.
  - `background-color: var(--brand-secondary)`.
  - Active Link Style: `bg-primary/10`, `text-primary`, `border-r-4 border-primary`.

- **Footer (`footer.tsx`):**
  - `background-color: var(--brand-secondary)`.
  - Subtle "aurora" effect using a `radial-gradient`.

- **Cards, Modals, Inputs:**
  - Styled consistently using the color tokens defined above. `border-primary/20` or `border-primary/30` is used for borders to maintain a cohesive look.
  - Focus states consistently use `ring-primary` for a clear visual cue.

- **Interactive Pricelist (`/cennik`):**
  - Built with ShadCN `Tabs` and `Accordion` components for a clean, organized, and interactive layout.
  - The pricelist is divided into "Dámsky cenník" and "Pánsky cenník" using tabs. Within each tab, services are grouped into collapsible categories (e.g., "Strihy a styling", "Farbenie").
  - Data Source: All pricing information is managed centrally in `src/lib/pricelist-data.ts`, making updates easy and consistent.
  - Each category is highlighted with a unique icon from `lucide-react`, and the overall design follows the application's luxurious dark theme with gold accents.

---

## Kompletný Cenník Služieb


### DÁMSKY CENNÍK


#### Strihy a styling

- **Strih:** od 30 € *(umytie, strihanie, styling, trvanie: 1 h)*
- **Finálny styling:** od 20 € *(úprava účesu na konkrétnu príležitosť, trvanie: 30 min.)*
- **Spoločenský účes:** 40 € *(detailný styling na spoločenské udalosti, trvanie: 1 h)*
- **Fúkaná (
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

