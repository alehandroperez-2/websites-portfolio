# GitHub Pages deployment

This repository is prepared to publish all eleven portfolio demos as one GitHub Pages project site.

## Published structure

- `/` — portfolio directory
- `/dental/`
- `/vet/`
- `/restaurant/`
- `/hotel/`
- `/realestate/`
- `/construction/`
- `/construction-fieldbook/`
- `/saas/`
- `/analytics/`
- `/legal/`
- `/shop/`

The workflow in `.github/workflows/deploy-pages.yml` installs the locked dependencies, builds every workspace, assembles `pages-dist/`, validates the assembled artifact, and deploys that artifact. `pages-dist/` is generated and is not committed.

## Local release check

```powershell
cd E:\Projects\websites-portfolio
npm ci
npm run check:pages
npm run preview:pages
```

Open `http://127.0.0.1:4179/` after the preview server starts.

## First publication

1. Create an empty GitHub repository named `websites-portfolio`. Do not initialize it with a README, license, or `.gitignore` because those files already exist locally.
2. Add the new repository as `origin`, commit the local repository, and push `main`.
3. In the GitHub repository, open **Settings → Pages** and choose **GitHub Actions** as the source.
4. If the first workflow ran before Pages was enabled, open **Actions → Deploy portfolio to GitHub Pages → Run workflow**.

For an owner named `OWNER`, the project URL will be:

```text
https://OWNER.github.io/websites-portfolio/
```

No custom domain is configured. Add one only after the default Pages URL has passed a live smoke test.

