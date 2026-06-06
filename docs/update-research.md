# Updating Research Themes And Projects

Before editing research themes or projects, create a PR branch from the latest `main`:

```bash
git switch main
git pull
git switch -c update-research-content
git branch --show-current   # should not print "main"
```

Do not edit research content directly on `main`. See [pull-request-workflow.md](pull-request-workflow.md) for the full flow.

The research area has two content layers:

- Themes in `src/data/themes.json`
- Funded projects in `src/data/projects.json`

Both are rendered under `/research/[slug]`. That means theme IDs and project IDs must not collide.

## Research Themes

Themes appear on:

- Homepage research themes
- `/research`
- `/research/<theme-id>`
- Publication filters

Example theme:

```json
{
  "id": "cps-security-semantics",
  "title": "Cyber-Physical Systems Security & Semantics",
  "summary": "We recover system semantics from legacy and modern cyber-physical systems, then use that structure to test, harden, and explain behavior in physical testbeds.",
  "projectIds": ["nsf-sphere", "nsf-fmitf", "darpa-smellcps"],
  "featuredPubIds": [
    "garcia2019-hyplc",
    "wang2022-autocps"
  ],
  "image": "/images/themes/cps-security-semantics.jpg"
}
```

Theme fields:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | URL slug under `/research/<id>` |
| `title` | yes | Display title |
| `summary` | yes | Short explanation used across the site |
| `projectIds` | yes | IDs from `projects.json` |
| `featuredPubIds` | yes | IDs from `publications.json` |
| `image` | no | Theme visual under `public/images/themes/` |

## Funded Projects

Projects appear on:

- Homepage projects section
- `/projects`
- `/research`
- `/research/<project-id>`
- Theme pages
- Profile pages when linked through `current_projects`

Example project:

```json
{
  "id": "example-project",
  "title": "Example CPS Security Project",
  "agency": "NSF",
  "awardNumber": "NSF 1234567",
  "years": "2026-2029",
  "status": "active",
  "themes": ["cps-security-semantics"],
  "abstract": "One concise paragraph describing the project and why it matters.",
  "overview": [
    "Longer paragraph for the project detail page.",
    "Another paragraph if needed."
  ],
  "capabilities": [
    "What the project enables"
  ],
  "useCases": [
    "Where this work applies"
  ],
  "publicStatus": "Public artifacts are available. More materials will be released as they mature.",
  "links": [
    {
      "label": "Project Website",
      "url": "https://example.org"
    }
  ],
  "figures": [
    {
      "image": "/images/projects/example/figure-1.png",
      "caption": "Figure caption."
    }
  ],
  "team": ["L. Garcia"],
  "publications": ["example2026-paper"],
  "heroImage": "/images/projects/example/hero.jpg"
}
```

Project fields:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | URL slug under `/research/<id>` |
| `title` | yes | Project title |
| `agency` | yes | Funding agency or program |
| `awardNumber` | no | Award/program number |
| `years` | yes | Human-readable duration |
| `status` | yes | `active`, `completed`, or `proposed` |
| `themes` | yes | Theme IDs from `themes.json` |
| `abstract` | yes | Short project summary |
| `overview` | no | Paragraphs for project detail page |
| `capabilities` | no | Bulleted capability cards |
| `useCases` | no | Detail page list |
| `publicStatus` | no | Public release/status note |
| `links` | no | Related external/internal links |
| `figures` | no | Project figures with captions |
| `team` | yes | Human-readable names or project team labels |
| `publications` | yes | Publication IDs |
| `heroImage` | yes | Project hero image path |

## Cross-Reference Rules

- Every `themes` value in a project must exist in `themes.json`.
- Every `projectIds` value in a theme must exist in `projects.json`.
- Every `featuredPubIds` and `publications` value should exist in `publications.json`.
- Theme IDs and project IDs cannot be the same because both use `/research/[slug]`.

## Images

Theme images:

```text
public/images/themes/
```

Project images:

```text
public/images/projects/<project-folder>/
```

Use root-relative paths in JSON:

```json
"/images/projects/example/hero.jpg"
```

## Checks

```bash
npx tsx scripts/validate-themes.ts
npm run lint:links
npm run build
```

Run these before opening a PR for research changes.
