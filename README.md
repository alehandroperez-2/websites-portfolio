# Web Development Portfolio Showcase

Eleven independent static website concepts for Mykola M's web-development portfolio. The repository includes a GitHub Pages release pipeline but has no remote and is not deployed yet.

## Sites

| Demo | Workspace | GitHub Pages route |
| --- | --- | --- |
| Vela Dental Studio | `sites/dental` | `/dental/` |
| Kindred Paws Veterinary Clinic | `sites/vet` | `/vet/` |
| Sora Table Restaurant | `sites/restaurant` | `/restaurant/` |
| Northlight House Hotel | `sites/hotel` | `/hotel/` |
| Atria Estates | `sites/realestate` | `/realestate/` |
| Forge & Field Command Center | `sites/construction` | `/construction/` |
| Forge & Field Field Book | `sites/construction-fieldbook` | `/construction-fieldbook/` |
| Fluxlane AI | `sites/saas` | `/saas/` |
| Metricline Analytics | `sites/analytics` | `/analytics/` |
| Halden Legal | `sites/legal` | `/legal/` |
| ORRA Runway Film Store | `sites/shop` | `/shop/` |

## Local use

```powershell
npm install
npm run dev:dental
npm run dev:construction
npm run dev:construction-fieldbook
npm run dev:shop
npm run check
npm run test:browser
```

To build and validate the exact artifact used by GitHub Pages:

```powershell
npm run check:pages
npm run preview:pages
```

The local Pages preview is then available at `http://127.0.0.1:4179/`. Deployment setup and the remaining owner steps are documented in [`DEPLOYMENT.md`](DEPLOYMENT.md).

Each concept also has a matching independent production command. For example:

```powershell
npm run build:construction
npm run build:construction-fieldbook
npm run build:shop
```

The same `build:<slug>` convention is available for all eleven concepts. Each workspace can also be run directly with `npm --workspace @showcase/<name> run dev`. Vite prints the local URL.

## Enhanced product interactions

- All eleven concepts share a restrained product-polish layer: settled page entrances, section reveals, scroll progress, navigation state, keyboard-friendly tabs, dialog backdrop dismissal, responsive motion and reduced-motion fallbacks.
- Vela Dental now removes the hero artwork seam, adds treatment-card detail and completes its appointment simulation with a clear local-only confirmation.
- Sora Table now includes a responsive, continuously moving featured-dish carousel with manual controls, pause behavior, dish-to-menu focus and a completed Tonight's Menu experience.
- Northlight House now validates real date order, presents a readable guest selector, returns a local availability summary and compares up to two rooms.
- Metricline Analytics uses a deterministic Decision Room with question presets, KPI movement, ranked drivers, confidence, evidence and a decision trail.
- Halden Legal uses a four-route Matter Pathfinder that updates preparation, expertise and a fictional lead professional without requesting confidential information.
- Atria Estates adds an illustrative Neighbourhood Lens, richer property context, unlimited browser-local favourites and comparison of the first two saved homes.
- Kindred Paws adds a hero Care Navigator with immediate preparation and fictional availability; the emergency route bypasses the appointment simulation.
- The final motion pass adds hidden-tab pausing, immediate animated state feedback, Northlight room and gallery imagery, Atria property photography with a resizable zoomable map, deterministic Fluxlane ambient lights, Halden fictional-professional portraits and six complete ORRA product images.

## Product boundaries

- Every brand, person, address, review, service, price, listing, and product is fictional.
- Forms validate and simulate success locally. They never transmit or retain personal data.
- No analytics, trackers, cookies, external APIs, or API keys are used.
- Motion has a `prefers-reduced-motion` fallback.
- Generated imagery is local and documented in [`ASSET_CREDITS.md`](ASSET_CREDITS.md); representation review is recorded in [`AI_ART_REVIEW.md`](AI_ART_REVIEW.md).
- GitHub Pages publishes only the generated static demos. It does not add analytics, form submission, external storage, or server-side behavior.

## Review order

Review one site at a time in the sequence above. For each, check 1440 px, 1024 px, and 390 px widths; keyboard navigation; visible focus; labels; contrast; form copy; reduced motion; and that simulated actions make no network writes.

