# IOTrust Lab Website

Official website for IOTrust Lab at the University of Utah.

Live site: https://iotrustlab.com

This repository is a static-export Next.js site deployed with GitHub Pages. Most site content is edited through JSON files in `src/data/` and images in `public/images/`.

## First: Work On A PR Branch

Use a GitHub pull request for normal website updates. Do not make site-content changes directly on `main`.

Before editing a profile, project, news item, publication, image, or page text, create a new branch from the latest `main`:

```bash
git switch main
git pull
git switch -c update-my-profile   # choose a short branch name for your change
git branch --show-current         # should not print "main"
npm install
npm run dev
```

Make your content changes, preview them at `http://localhost:3000`, then run:

```bash
npm run lint
npm run lint:links
npm run build
```

Commit your work and open a pull request:

```bash
git status
git add <files-you-changed>
git commit -m "Update my profile"
git push -u origin update-my-profile
```

GitHub will deploy the site after the PR is reviewed, merged into `main`, and the Pages workflow finishes.

## Start Here

After you are on a PR branch, use the relevant guide:

| Need to do this | Read this |
| --- | --- |
| Run the site locally | [docs/local-development.md](docs/local-development.md) |
| Open a GitHub pull request | [docs/pull-request-workflow.md](docs/pull-request-workflow.md) |
| Understand pages, routes, and data files | [docs/site-structure.md](docs/site-structure.md) |
| Update your people/profile page | [docs/update-profiles.md](docs/update-profiles.md) |
| Add or edit research themes and funded projects | [docs/update-research.md](docs/update-research.md) |
| Add a news post | [docs/update-news.md](docs/update-news.md) |
| Add or edit publications | [docs/update-publications.md](docs/update-publications.md) |
| Update courses, lab info, footer/contact basics | [docs/update-courses-and-lab-info.md](docs/update-courses-and-lab-info.md) |
| Prepare images, PDFs, and other assets | [docs/assets-and-media.md](docs/assets-and-media.md) |
| Understand deployment | [docs/deployment.md](docs/deployment.md) |

## Repository Map

```text
src/app/                 Next.js routes and page components
src/components/          Shared UI components
src/data/                Site content edited by lab members
src/data/profiles/       Individual member profile JSON files
src/lib/                 Data loaders, SEO helpers, utilities
public/images/           Images served by the website
public/docs/             Public PDFs and downloadable files
docs/                    Contributor documentation
scripts/                 Validation, import, and generation scripts
```

Most updates do not require editing React components. Start with the docs page for the section you want to update.

## Important Rules

- Do not commit secrets, private datasets, internal credentials, or unpublished sensitive material.
- Use root-relative asset paths such as `/images/team/example.jpg`.
- Keep IDs stable once they are public. IDs become URLs, anchors, and cross-file references.
- Use `type: "json"` for normal people/profile entries.
- Check that every referenced image or PDF exists under `public/`.
- Prefer clear factual content over marketing copy.

## Tech Stack

- Next.js 16 with App Router and static export
- React 19
- TypeScript
- Tailwind CSS 3
- GitHub Pages

## Useful Commands

```bash
npm run dev              # Local dev server
npm run lint             # ESLint
npm run lint:links       # Internal references and public asset checks
npx tsx scripts/validate-themes.ts
npm run build            # Static production build
npm run deploy           # Local build plus out/.nojekyll marker
```

`npm run build` also regenerates Open Graph images through `npm run generate:og`.

## Getting Help

Look at nearby examples before adding new content. Existing files in `src/data/` are the best templates because they are already rendered by the site.

If you are unsure which fields to use, open a small draft PR and ask for review.
