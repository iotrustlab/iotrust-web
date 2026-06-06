# Deployment

The website deploys to GitHub Pages from the `main` branch.

## Deployment Flow

1. A pull request is reviewed and merged into `main`.
2. GitHub Actions runs `.github/workflows/deploy.yml`.
3. The workflow installs dependencies with `npm ci`.
4. It runs `npm run build`.
5. Next.js exports static files into `out/`.
6. GitHub Pages publishes `out/`.

Live site:

```text
https://iotrustlab.com
```

## Build Environment

The workflow uses:

```yaml
node-version: "22"
```

The app itself is static after build. Node is only used during dependency install and site generation.

## Local Deployment Check

Before merging a content PR:

```bash
npm run build
```

For a fuller local deploy-style command:

```bash
npm run deploy
```

That runs the build and adds `out/.nojekyll`, which helps GitHub Pages serve Next static assets correctly.

## What Gets Published

Only generated static output in `out/` is published by the workflow.

Public source assets come from:

```text
public/
```

Generated pages come from:

```text
src/app/
src/data/
src/components/
```

## After Merge

After a PR is merged:

1. Open the repository Actions tab.
2. Find the latest `Deploy to GitHub Pages` run.
3. Wait for it to complete.
4. Check the changed live page.

If the workflow fails, open the failed job log. Most failures are:

- Invalid JSON
- Missing image path
- Broken cross-reference between themes/projects/publications
- TypeScript or build error

## Rollback

If a bad change reaches production:

1. Open a PR that reverts or fixes the problem.
2. Merge after review.
3. Wait for GitHub Pages to redeploy.

Avoid force-pushing or rewriting `main` history for normal content mistakes.
