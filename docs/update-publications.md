# Updating Publications

Before editing publications, create a PR branch from the latest `main`:

```bash
git switch main
git pull
git switch -c add-publication
git branch --show-current   # should not print "main"
```

Do not edit publications directly on `main`. See [pull-request-workflow.md](pull-request-workflow.md) for the full flow.

Publications live in:

```text
src/data/publications.json
```

They appear on:

- Homepage recent publications
- `/publications`
- Research theme pages
- Project pages
- Profile pages through author-name matching

## Add A Publication

Add an entry to `recentPublications`.

Example:

```json
{
  "id": "doe2026-example",
  "title": "Example Paper Title",
  "authors": [
    "Jane Doe",
    "Luis Garcia"
  ],
  "venue": "Example Conference 2026",
  "year": 2026,
  "type": "conference",
  "doi": "10.0000/example",
  "abstract": "One concise abstract or summary for the website.",
  "keywords": [
    "Cyber-Physical Systems",
    "Verification"
  ],
  "url": "https://doi.org/10.0000/example",
  "links": [
    {
      "label": "PDF",
      "url": "https://example.org/paper.pdf"
    }
  ],
  "tags": [
    "Accepted Paper"
  ],
  "themeIds": [
    "cps-security-semantics"
  ]
}
```

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable publication ID and anchor |
| `title` | yes | Paper title |
| `authors` | yes | Array of author names |
| `venue` | yes | Conference, journal, workshop, or preprint venue |
| `year` | yes | Number |
| `type` | yes | `journal`, `conference`, `workshop`, or `preprint` |
| `doi` | no | DOI string |
| `abstract` | yes | Can be `""` if unavailable |
| `keywords` | yes | Can be `[]` |
| `url` | no | Main paper link |
| `links` | no | Additional links such as PDF, code, arXiv |
| `tags` | no | Display labels |
| `themeIds` | no | Theme IDs from `themes.json` |
| `pages` | no | Page range |
| `volume` | no | Volume number/string |
| `organization` | no | Publisher/organization |
| `awards` | no | Awards or distinctions |

## ID Convention

Use a stable ID:

```text
firstauthorYEAR-short-title
```

Examples:

```text
paul2025-hytwin
sayom2025-property-guided
garcia2025-sphere
```

Avoid spaces, punctuation-heavy IDs, or generated strings that are hard to read.

## Linking Publications To Themes

Use `themeIds`:

```json
"themeIds": [
  "digital-twins-verification",
  "digital-twinning-for-ics"
]
```

This controls:

- Theme detail pages
- Publication filters
- Some homepage/theme relationships

## Linking Publications To Projects

Project pages pull selected publications from `src/data/projects.json`:

```json
"publications": [
  "paul2025-hytwin"
]
```

If a publication belongs to a project, add its ID to the relevant project entry.

## Linking Publications To Profiles

Profile pages match by author name. If a lab member publishes under multiple spellings, update their profile:

```json
"publication_names": [
  "Jane Doe",
  "J. Doe",
  "Doe, Jane"
]
```

See [update-profiles.md](update-profiles.md).

## BibTeX Import

There is a helper script:

```bash
python3 scripts/bib_to_pubs_json.py --bib input.bib --out output.json
```

Treat the output as a draft. Review IDs, author names, venue names, theme IDs, links, and abstracts before committing.

## Checks

```bash
npx tsx scripts/validate-themes.ts
npm run build
```

Common failures:

- `themeIds` references a missing theme.
- Project `publications` references a missing publication.
- Author spelling does not match a member profile.
