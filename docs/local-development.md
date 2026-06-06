# Local Development

This page explains how to run and verify the website locally before opening a pull request.

## Before You Edit

Make sure you are on a PR branch, not `main`, before changing website content:

```bash
git switch main
git pull
git switch -c update-my-content
git branch --show-current   # should not print "main"
```

See [pull-request-workflow.md](pull-request-workflow.md) for the full PR flow.

## Requirements

- Node.js 22 is recommended.
- npm is used for dependency management.
- Git is used for branch and PR workflow.

The GitHub Pages workflow also uses Node 22, so matching that locally reduces surprise.

## Install

```bash
npm install
```

If dependencies are already installed, you usually do not need to reinstall unless `package.json` or `package-lock.json` changed.

## Run The Site

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The dev server hot-reloads most changes. If a page looks stale after major data or config edits, stop the server with `Ctrl+C` and run `npm run dev` again.

## Validate Before PR

Run these from the repository root:

```bash
npm run lint
npm run lint:links
npx tsx scripts/validate-themes.ts
npm run build
```

What they check:

| Command | Purpose |
| --- | --- |
| `npm run lint` | TypeScript/React style and correctness checks through ESLint |
| `npm run lint:links` | JSON references, route files, and public image paths |
| `npx tsx scripts/validate-themes.ts` | Theme, project, and publication cross-references |
| `npm run build` | Full static production build |

`npm run build` is the closest local equivalent to the GitHub Pages build.

## Preview Static Output

The site is exported to `out/` during `npm run build`. For most content edits, checking the dev server and a successful build is enough.

## Common Local Issues

If a new image does not appear:

- Confirm the path starts with `/`.
- Confirm the file is under `public/`.
- Confirm spelling and extension match exactly, including `.jpg` vs `.jpeg`.

If a profile or project page is 404:

- Confirm the ID appears in the right index file.
- Confirm the ID in the JSON file matches the file name and references.
- Run `npm run lint:links`.

If a theme page fails:

- Confirm no theme ID collides with a project ID.
- Confirm every `projectIds`, `featuredPubIds`, and `themeIds` reference exists.
- Run `npx tsx scripts/validate-themes.ts`.
