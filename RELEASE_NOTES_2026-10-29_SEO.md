# Portfolio SEO AEO and GEO release notes

The website directory now identifies Mykola M and the work more clearly. All eleven fictional demonstrations receive consistent canonical, social and creator metadata in the assembled GitHub Pages artifact.

## Applied changes

- The directory uses a descriptive website-design/development heading, factual creator introduction, prominent fictional/demo boundaries, and links to Mykola's actual website and enquiry section.
- Responsive heading wrapping and keyboard-focus styling preserve usability at narrow widths.
- `scripts/seo-metadata.mjs` adds a self-canonical and accurate Open Graph/Twitter metadata to the directory and every demo during assembly. The existing portfolio preview image is retained.
- Structured data connects the actual Person creator with the directory CollectionPage and eleven WebPage concepts. The directory lists all eleven concepts; fictional brands are not marked as real clinics, hotels, law firms, products, employers or customers.
- The assembled `sitemap.xml` lists the directory and eleven currently indexable demos.
- Artifact validation checks canonical/social URLs, parseable schema, creator references, the complete concept list, fictional labels, sitemap entries and the enquiry link, alongside existing asset and interaction safeguards.

Affected routes are `/`, `/dental/`, `/vet/`, `/restaurant/`, `/hotel/`, `/realestate/`, `/construction/`, `/construction-fieldbook/`, `/saas/`, `/analytics/`, `/legal/` and `/shop/` beneath `https://alehandroperez-2.github.io/websites-portfolio/`.

## Validation and release boundary

`npm.cmd run check:pages` builds all eleven demos, assembles the deployment artifact and runs both validators. Visual verification remains incomplete because the GPT browser bridge was unavailable and native browser automation stopped on an unverified browser URL. No physical iPhone/Threads check is claimed.

Generated bundles, local dependencies and diagnostic captures are not committed. Publication targets `origin/main`; the companion personal-website changes are released separately to its two Windows branches. No new ownership or licence claim over third-party assets is introduced.

## Deferred decisions

- DEFERRED to Mykola: whether fictional interactive demos should become `noindex,follow`. Existing indexability is preserved until that decision is made.
- DEFERRED to Mykola: real project case studies, new prices, customer outcomes and business claims require approved factual content. No invented results were added.
- NOT_APPLICABLE: a project-path `robots.txt` cannot control the GitHub host. No ineffective project robots file or special AI-only markup was added.
