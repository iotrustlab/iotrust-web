# Site Structure

This site is a Next.js App Router project exported as static HTML for GitHub Pages.

## Public Routes

| Route | Source | Main data |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | many files in `src/data/` |
| `/research` | `src/app/research/page.tsx` | `themes.json`, `projects.json`, `publications.json` |
| `/research/[slug]` | `src/app/research/[slug]/page.tsx` | theme IDs and project IDs |
| `/projects` | `src/app/projects/page.tsx` | `projects.json` |
| `/news` | `src/app/news/page.tsx` | `news.json` |
| `/news/[id]` | `src/app/news/[id]/page.tsx` | `news.json` |
| `/publications` | `src/app/publications/page.tsx` | `publications.json` |
| `/courses` | `src/app/courses/page.tsx` | `courses.json` |
| `/people` | `src/app/people/page.tsx` | `people-index.json`, `profiles/*.json` |
| `/people/[slug]` | `src/app/people/[slug]/page.tsx` | `profiles/<id>.json` |
| `/opportunities` | `src/app/opportunities/page.tsx` | static component text |
| `/contact` | `src/app/contact/page.tsx` | `lab-info.json` |
| `/bio` | `src/app/bio/page.tsx` | `lab-info.json` |

The dynamic routes are still static pages. Their possible paths are generated at build time from JSON IDs.

## Data Files

```text
src/data/
  lab-info.json
  people-index.json
  profiles/
  news.json
  publications.json
  publications/references.bib
  themes.json
  projects.json
  courses.json
  research-projects/
```

Main editable files:

- `profiles/*.json`: individual member pages.
- `people-index.json`: which people appear in which people section.
- `news.json`: news index and news detail pages.
- `publications.json`: publication list and publication filtering.
- `themes.json`: research themes.
- `projects.json`: funded projects and project detail pages.
- `courses.json`: course cards.
- `lab-info.json`: PI bio, lab metadata, contact/footer basics.

## Assets

```text
public/images/team/       People headshots
public/images/news/       News images
public/images/themes/     Research theme images
public/images/projects/   Project hero and figure images
public/images/social/     Generated social preview images
public/docs/              Public PDFs and downloadable files
```

Paths in JSON should be root-relative:

```json
"/images/team/example.jpg"
```

Do not use relative paths such as `../images/example.jpg`.

## ID Rules

IDs are important. They become URLs and cross-file references.

Examples:

| Data | ID | Public URL or reference |
| --- | --- | --- |
| Profile | `nsssayom` | `/people/nsssayom` |
| News | `2026-mountain-money-mythos-garcia` | `/news/2026-mountain-money-mythos-garcia` |
| Theme | `cps-security-semantics` | `/research/cps-security-semantics` |
| Project | `darpa-smellcps` | `/research/darpa-smellcps` |
| Publication | `sayom2025-property-guided` | `/publications#sayom2025-property-guided` |

Keep IDs lowercase and URL-safe:

```text
letters, numbers, hyphens, and underscores
```

Avoid changing an existing ID after it is published unless you are intentionally changing the URL.

## Home Page Sections

The homepage pulls from the same data:

- Hero: `lab-info.json`
- Research themes: `themes.json`
- News: latest entries from `news.json`
- Recent publications: `publications.json`
- People: `people-index.json` and `profiles/*.json`
- Projects: `projects.json`
- Courses: `courses.json`
- Opportunities/contact: page content and `lab-info.json`

Updating section data usually updates both the homepage and the full section page.
