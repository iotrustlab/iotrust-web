# IoTrust Lab Website

A modern, responsive website for IoTrust Lab built with Next.js, TypeScript, and Tailwind CSS. This README focuses on how to update site content and run the project.

## Quick Reference

**Most common tasks:**
- **Add news item:** Edit `src/data/news.json`, add image to `/public/images/news/`
- **Add team member:** Create `src/data/profiles/<id>.json`, update `src/data/people-index.json`
- **Add publication:** Edit `src/data/publications.json`
- **Add project:** Edit `src/data/projects.json`
- **Add research theme:** Edit `src/data/themes.json`
- **Test changes:** `npm run dev` → `npm run build` → `npm run start`

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
- `src/data/themes.json` — Research themes (title, summary, related projects, featured publications, image).
- `src/data/projects.json` — Funded projects (agency, years, status, themes, abstract, hero image, team).
- `src/data/publications.json` — Publications (title, authors, venue, year, type, optional awards).
- `src/data/courses.json` — Courses/teaching entries.
- `src/data/news.json` — News items (title, date, summary, tags, image).

Images live in `/public/images/`.
- Logos: `/public/images/iotrust-logo.png` (light) and `/public/images/iotrust-logo-dark.png` (dark)
- Headshots: `/public/images/team/<person>.jpg`
- News images: `/public/images/news/<filename>.jpg`
- Theme images: `/public/images/themes/<theme-id>.jpg`
- Project hero images: `/public/images/projects/<project-id>/hero.jpg`
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

Edit `src/data/projects.json`:
- Use stable project IDs (these map to `/research/<project-id>`).
- Keep `themes` in sync with `src/data/themes.json`.
- Use team member IDs defined in `profiles/*.json`.
- Set `heroImage` to a valid file in `/public/images/projects/...`.

Edit `src/data/themes.json` when creating/updating lines of research:
- `projectIds` must reference valid project IDs.
- `featuredPubIds` should reference publication IDs in `src/data/publications.json`.
- `image` should point to `/public/images/themes/<theme-id>.jpg`.

## Updating Publications

Edit `src/data/publications.json` to add/update items. You can also maintain a BibTeX file and convert offline, but the site reads from JSON.

## Updating Courses

Edit `src/data/courses.json`. The page at `/courses` renders the list automatically.

## Updating News

Edit `src/data/news.json` to add/update news items. Each news item should have:

```json
{
  "id": "unique-url-slug",
  "title": "News Title",
  "date": "YYYY-MM-DD",
  "tags": ["Tag1", "Tag2"],
  "summary": "Brief description of the news item.",
  "image": "/images/news/filename.jpg"
}
```

**Important notes:**
- `id` should be URL-safe (lowercase, dashes only)
- `date` format: YYYY-MM-DD (items are sorted newest first)
- `tags` array: optional, for categorization
- `image` path: optional, should be in `/public/images/news/`
- The homepage shows the 3 most recent items automatically
- Individual news pages are at `/news/[id]`

To add a new news item:
1. Add the JSON object to the array in `src/data/news.json`
2. Add the image to `/public/images/news/` if needed
3. Run `npm run build` to regenerate static pages

## Theming & Logos

- The `LogoMark` component auto-swaps between light and dark logos.
- Global theme tokens are in `src/app/globals.css` and brand colors in `tailwind.config.js`.
- To tweak hero or navbar logo sizes/spacing, see `src/app/page.tsx` and `src/components/navigation.tsx`.

## Where Things Render

- Home/hero/projects/publications/people summary: `src/app/page.tsx`
- People section cards: `src/components/team-member-card.tsx`
- Publications page: `src/app/publications/page.tsx` (client list in `src/components/publications-client.tsx`)
- Research hub + detail pages: `src/app/research/page.tsx` and `src/app/research/[slug]/page.tsx`
- Courses page: `src/app/courses/page.tsx`
- News index: `src/app/news/page.tsx`
- Individual news posts: `src/app/news/[id]/page.tsx`
- Recent news on homepage: `RecentNews` component in `src/app/page.tsx`

## Maintenance Workflow

### Adding New Content

1. **New Team Member:**
   - Create profile in `src/data/profiles/<id>.json`
   - Add ID to appropriate category in `src/data/people-index.json`
   - Add headshot to `/public/images/team/`

2. **New Research Project:**
   - Add to `src/data/projects.json`
   - Use existing team member IDs
   - Associate with one or more themes in `src/data/themes.json`

3. **New Publication:**
   - Add to `src/data/publications.json`
   - Include all required fields (title, authors, venue, year)

4. **New News Item:**
   - Add to `src/data/news.json`
   - Use URL-safe ID (lowercase, dashes)
   - Add image to `/public/images/news/` if needed

5. **New Course:**
   - Add to `src/data/courses.json`

### After Making Changes

1. **Test locally:**
   ```bash
   npm run dev
   # Visit http://localhost:3000 to check changes
   ```

2. **Build and test production:**
   ```bash
   npm run build
   npm run start
   # Test the static export
   ```

3. **Check for issues:**
   ```bash
   npm run lint
   npm run lint:links
   npx tsx scripts/validate-themes.ts
   ```

## Image Intake (Overleaf / Claude Outputs)

If you export figures from Overleaf or Claude diagrams, place them in:

`assets/image-intake/`

Then run:

```bash
npm run images:import
```

The importer will:
- map source files to theme/project/news image targets
- convert and crop to web-ready JPGs
- keep paths stable so page code does not need updates

See `assets/image-intake/README.md` for expected filenames.

## Useful Scripts

- `npm run dev` — Start development server
- `npm run build` — Static export build
- `npm run start` — Serve production (static export)
- `npm run lint` — Run ESLint
- `npm run export:project-report` — Generate a markdown report of projects (in `scripts/export_project_report.ts`)
- `npm run lint:links` — Check for broken links (in `scripts/check_links.ts`)
- `npm run images:import` — Import Overleaf/Claude source visuals into site image paths

## Troubleshooting

### Common Issues

1. **Build fails with "missing generateStaticParams" error:**
   - This happens when adding new dynamic routes (like `/news/[id]`)
   - Make sure `generateStaticParams()` function exists in the dynamic route file

2. **Images not showing:**
   - Check that image paths in JSON files start with `/images/`
   - Ensure images exist in `/public/images/` directory
   - For news images, use `/public/images/news/` directory

3. **Navigation not working:**
   - Check that all links in `src/components/navigation.tsx` are correct
   - For scroll-based navigation, ensure target elements have matching IDs

4. **TypeScript errors:**
   - Run `npm run lint` to see specific errors
   - Check that JSON files match expected TypeScript interfaces

### Performance Tips

- Keep images optimized (use tools like `imagemin` or online compressors)
- News images should be reasonable size (under 500KB recommended)
- Use WebP format for better compression when possible

## Deployment (GitHub Pages)

This repo is configured for GitHub Pages under a sub-path. `next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and the correct `basePath`/`assetPrefix` for the repo.

If you deploy elsewhere (root domain), remove `basePath` and `assetPrefix` in `next.config.ts`.

Asset path notes when using a sub-path:
- `<Image>` and static `/public` assets are automatically prefixed
- Internal links are prefixed

### Deployment Steps

1. Make your content changes
2. Test locally with `npm run build && npm run start`
3. Commit and push to GitHub
4. GitHub Actions will automatically build and deploy
5. Check the deployed site for any issues

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- next-themes (dark/light mode)
- Lucide icons

## License

This project is private and proprietary to IoTrust Lab.
