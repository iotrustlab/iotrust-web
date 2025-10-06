# IoTrust Lab Website

A modern, responsive website for IoTrust Lab built with Next.js, TypeScript, and Tailwind CSS. This README focuses on how to update site content and run the project.

## Quick Start

1) Install dependencies
```bash
npm install
```
2) Run locally
```bash
npm run dev
```
3) Build static export
```bash
npm run build
```

Node version: use Node 20 (tested with `nvm use 20`).

## Content Model (JSON-first)

All content lives in JSON files under `src/data/`. Update these to change the website.

- `src/data/lab-info.json` — Lab name, mission, focus areas, PI contact, university info.
- `src/data/people-index.json` — Index of people by category:
  - `principalInvestigator`: array of IDs
  - `postdocs`: array of IDs
  - `phdStudents`: array of IDs
  - `undergrads`: array of IDs
  - `alumni`: array of IDs
- `src/data/profiles/*.json` — One file per person (id, name, role, email, image, links, etc.).
- `src/data/research-projects.json` — Featured projects (title, description, team IDs, keywords). Avoid money amounts; use agency + duration.
- `src/data/publications.json` — Publications (title, authors, venue, year, type, optional awards).
- `src/data/courses.json` — Courses/teaching entries.

Images live in `/public/images/`.
- Logos: `/public/images/iotrust-logo.png` (light) and `/public/images/iotrust-logo-dark.png` (dark)
- Headshots: `/public/images/team/<person>.jpg`
- Placeholder avatar: `/public/images/profile-avatar-placeholder.png`

## Updating People

1) Add a profile file in `src/data/profiles/<id>.json`:
```json
{
  "id": "jane_doe",
  "name": "Jane Doe",
  "role": "PhD Student",
  "email": "jane@utah.edu",
  "image": "/images/profile-avatar-placeholder.png",
  "type": "json"
}
```
2) Reference that ID in `src/data/people-index.json` under the correct category (postdocs / phdStudents / undergrads / alumni).
3) Drop the headshot into `/public/images/team/<file>.jpg` and set `image` to that path. If missing, the placeholder is used.
4) Ordering: lists are automatically sorted by last name.

## Updating Projects

Edit `src/data/research-projects.json`:
- Use team member IDs defined in `profiles/*.json`.
- Provide `keywords` for tag display.
- Funding: list only agency and duration (no dollar amounts).

## Updating Publications

Edit `src/data/publications.json` to add/update items. You can also maintain a BibTeX file and convert offline, but the site reads from JSON.

## Updating Courses

Edit `src/data/courses.json`. The page at `/courses` renders the list automatically.

## Theming & Logos

- The `LogoMark` component auto-swaps between light and dark logos.
- Global theme tokens are in `src/app/globals.css` and brand colors in `tailwind.config.js`.
- To tweak hero or navbar logo sizes/spacing, see `src/app/page.tsx` and `src/components/navigation.tsx`.

## Where Things Render

- Home/hero/projects/publications/people summary: `src/app/page.tsx`
- People section cards: `src/components/team-member-card.tsx`
- Publications page: `src/app/publications/page.tsx` (client list in `src/components/publications-client.tsx`)
- Research projects grid: `src/components/research-projects.tsx`
- Courses page: `src/app/courses/page.tsx`

## Useful Scripts

- `npm run dev` — Start development server
- `npm run build` — Static export build
- `npm run start` — Serve production (static export)
- `npm run lint` — Run ESLint
- `npm run export:project-report` — Generate a markdown report of projects (in `scripts/export_project_report.ts`)
- `npm run lint:links` — Check for broken links (in `scripts/check_links.ts`)

## Deployment (GitHub Pages)

This repo is configured for GitHub Pages under a sub-path. `next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and the correct `basePath`/`assetPrefix` for the repo.

If you deploy elsewhere (root domain), remove `basePath` and `assetPrefix` in `next.config.ts`.

Asset path notes when using a sub-path:
- `<Image>` and static `/public` assets are automatically prefixed
- Internal links are prefixed

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- next-themes (dark/light mode)
- Lucide icons

## License

This project is private and proprietary to IoTrust Lab.

