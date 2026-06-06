# Updating Courses And Lab Info

Before editing courses, lab info, contact details, or footer-facing metadata, create a PR branch from the latest `main`:

```bash
git switch main
git pull
git switch -c update-lab-info
git branch --show-current   # should not print "main"
```

Do not edit this content directly on `main`. See [pull-request-workflow.md](pull-request-workflow.md) for the full flow.

This page covers lower-frequency site metadata:

- Courses in `src/data/courses.json`
- Lab/PI/contact metadata in `src/data/lab-info.json`

## Courses

Courses appear on:

- Homepage courses section
- `/courses`

Edit:

```text
src/data/courses.json
```

Example:

```json
{
  "id": "cs-6963-5963-cps-security",
  "title": "CS 6963/5963: CPS/IoT Security and Safety",
  "code": "CS 6963/5963",
  "institution": "University of Utah",
  "terms": ["Fall 2024"],
  "description": "Graduate-level project-based course exploring security and safety challenges in cyber-physical and IoT systems.",
  "level": "Graduate",
  "credits": 3,
  "prerequisites": ["CS 4400 or equivalent"],
  "topics": [
    "Cyber-Physical Systems Security",
    "IoT Security"
  ]
}
```

Course fields:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable course ID |
| `title` | yes | Full display title |
| `code` | yes | Course code |
| `institution` | yes | Institution name |
| `terms` | yes | Array of terms |
| `description` | yes | Public course summary |
| `level` | yes | Undergraduate, Graduate, etc. |
| `credits` | yes | Number |
| `prerequisites` | no | Array of strings |
| `topics` | yes | Array of topic labels |

## Lab Info

Lab info appears in:

- Homepage hero/support content
- Contact page
- Bio page
- Footer
- SEO metadata in some contexts

Edit:

```text
src/data/lab-info.json
```

Important sections:

```json
{
  "lead": {
    "name": "Dr. Luis A. Garcia",
    "title": "Assistant Professor",
    "department": "Kahlert School of Computing",
    "university": "University of Utah",
    "email": "la.garcia@utah.edu",
    "bio": "Public PI bio.",
    "image": "/images/team/luis-garcia.jpg",
    "credentials": "PhD in Computer Engineering, Rutgers University"
  },
  "mission": "Short lab mission text.",
  "focus_areas": [
    "Cyber-Physical Systems (CPS) Security"
  ],
  "university": {
    "name": "University of Utah",
    "department": "Kahlert School of Computing",
    "address": {
      "street": "50 Central Campus Dr",
      "city": "Salt Lake City",
      "state": "Utah",
      "zip": "84112"
    }
  }
}
```

## Banner Settings

`lab-info.json` includes a `banner` object:

```json
"banner": {
  "enabled": false,
  "image": "/images/banners/lab-banner.jpg",
  "alt": "IoTrust Lab Banner",
  "showOnMobile": true,
  "position": "above-title",
  "height": {
    "mobile": "h-16",
    "tablet": "h-24",
    "desktop": "h-32"
  },
  "fullWidth": false
}
```

Only enable this if the banner is intentionally part of the page design. Most routine content updates should not touch it.

## Copy Guidance

- Keep mission and focus text concise.
- Avoid internal-only phrasing.
- Avoid claims that will age quickly unless someone owns updates.
- Use official school/university names consistently.

## Checks

```bash
npm run lint:links
npm run build
```
