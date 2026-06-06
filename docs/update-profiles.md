# Updating People And Profiles

Before editing a profile, create a PR branch from the latest `main`:

```bash
git switch main
git pull
git switch -c update-my-profile
git branch --show-current   # should not print "main"
```

Do not edit profiles directly on `main`. See [pull-request-workflow.md](pull-request-workflow.md) for the full flow.

People content has two parts:

1. A profile file in `src/data/profiles/<id>.json`
2. A group entry in `src/data/people-index.json`

The profile file controls the detail page. The index controls where the person appears in people listings.

## Update Your Existing Profile

Find your file:

```text
src/data/profiles/<your-id>.json
```

Edit the fields you need, then preview:

```bash
npm run dev
```

Check:

```text
http://localhost:3000/people
http://localhost:3000/people/<your-id>
```

## Add A New Person

Create a profile file:

```text
src/data/profiles/jane_doe.json
```

Minimal profile:

```json
{
  "id": "jane_doe",
  "name": "Jane Doe",
  "role": "PhD Student",
  "title": "Graduate Research Assistant",
  "department": "Kahlert School of Computing",
  "university": "University of Utah",
  "email": "jane.doe@utah.edu",
  "image": "/images/team/jane-doe.jpg",
  "bio": "Jane Doe studies trustworthy cyber-physical systems with an emphasis on secure sensing and verification.",
  "research_interests": [
    "Cyber-Physical Systems Security",
    "Formal Verification"
  ],
  "type": "json"
}
```

Add the person to `src/data/people-index.json`:

```json
"phdStudents": [
  { "id": "jane_doe", "type": "json" }
]
```

Use one of these groups:

- `principalInvestigator`
- `postdocs`
- `phdStudents`
- `mastersStudents`
- `undergrads`
- `alumni`

## Profile Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Must match the file name and people-index entry |
| `name` | yes | Display name |
| `role` | yes | Section/profile role, for example `PhD Student` |
| `title` | no | More specific title |
| `department` | no | Defaults visually to lab/school context if absent |
| `university` | no | Usually `University of Utah` |
| `email` | yes | Rendered as an obfuscated email link |
| `image` | yes | Use an existing image or `/images/profile-avatar-placeholder.png` |
| `bio` | no | Main profile paragraph |
| `advisor` | no | Object with `name` and optional `url` |
| `location` | no | City or location |
| `office` | no | Office location |
| `research_interests` | no | Array of short labels |
| `education` | no | Array of degree entries |
| `experience` | no | Array of position entries |
| `current_projects` | no | Array of IDs from `src/data/projects.json` |
| `publications_count` | no | Manual display/support metadata |
| `publication_names` | no | Author name aliases for matching publications |
| `research_statement` | no | Profile detail section |
| `research_questions` | no | Array of question strings |
| `website` | no | External URL |
| `resume` | no | External URL or public PDF path |
| `linkedin` | no | External URL |
| `github` | no | External URL |
| `google_scholar` | no | External URL |
| `twitter` | no | Handle or URL |
| `type` | yes | Use `"json"` for normal profiles |

## Publications On Profile Pages

Profile pages match publications by author name. If your publications use different spellings, add `publication_names`.

Example:

```json
"publication_names": [
  "Jane Doe",
  "J. Doe",
  "Doe, Jane"
]
```

This helps the profile page find matching entries in `src/data/publications.json`.

## Project Links On Profile Pages

Use `current_projects` when a person should be connected to project detail pages:

```json
"current_projects": [
  "darpa-smellcps",
  "nsf-sphere"
]
```

Each ID must exist in `src/data/projects.json`.

## Headshots

Place profile images in:

```text
public/images/team/
```

Recommended:

- Use JPG or PNG.
- Crop to a square or portrait-friendly frame.
- Keep the final site asset reasonably sized, not a raw camera original.
- Use lowercase file names with hyphens.

Example:

```json
"image": "/images/team/jane-doe.jpg"
```

If no photo is available:

```json
"image": "/images/profile-avatar-placeholder.png"
```

## Furry Members

Furry members are edited directly in `src/data/people-index.json` under `furryMembers`.

Example:

```json
{
  "id": "valley",
  "name": "Valentina \"Valley\"",
  "species": "cat",
  "role": "Chief Purring Officer",
  "description": "Short public description.",
  "image": "/images/team/pets/valley-on-grass.jpeg"
}
```

Keep this content playful but still public-facing.

## Checks

```bash
npm run lint:links
npm run build
```

Common failures:

- Profile file name does not match `id`.
- `people-index.json` references a missing profile file.
- Image path points to a file that does not exist.
- `current_projects` references a missing project ID.
