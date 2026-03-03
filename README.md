# IoTrust Lab Website

The official website for IoTrust Lab at the University of Utah. Built with Next.js and hosted on GitHub Pages.

**Live site:** https://iotrustlab.com

---

## For Students: Update Your Profile

Your profile lives in `src/data/profiles/<your-id>.json`. Here's how to update it:

### 1. Find your profile file

```
src/data/profiles/
├── jane_doe.json      ← Your file is named after your ID
├── john_smith.json
└── ...
```

### 2. Edit your profile

Open your JSON file and update any fields:

```json
{
  "id": "jane_doe",
  "name": "Jane Doe",
  "role": "PhD Student",
  "email": "jane.doe@utah.edu",
  "image": "/images/team/jane-doe.jpg",
  "bio": "Brief bio about yourself and your research interests.",
  "research_interests": [
    "IoT Security",
    "Machine Learning"
  ],
  "website": "https://your-website.com",
  "google_scholar": "https://scholar.google.com/citations?user=YOUR_ID",
  "linkedin": "https://linkedin.com/in/your-profile",
  "github": "https://github.com/your-username",
  "twitter": "@your_handle",
  "type": "json"
}
```

### 3. Update your headshot

1. Add your photo to `/public/images/team/your-name.jpg`
2. Update the `"image"` field in your profile to match the path
3. Recommended: square image, at least 400x400px

### 4. Test and submit

```bash
# Test locally
npm install
npm run dev
# Open http://localhost:3000/people and check your profile

# If it looks good, commit and push
git add .
git commit -m "Update my profile"
git push
```

The site will automatically rebuild and deploy.

---

## Quick Reference

| Task | What to edit |
|------|--------------|
| Update your profile | `src/data/profiles/<your-id>.json` |
| Add your headshot | `/public/images/team/<name>.jpg` |
| Add a publication | `src/data/publications.json` |
| Add a news item | `src/data/news.json` + image in `/public/images/news/` |
| Add a course | `src/data/courses.json` |

---

## Development

### Setup

```bash
npm install
npm run dev      # Start dev server at http://localhost:3000
```

### Build & Test

```bash
npm run build    # Build static site
npm run start    # Preview production build
npm run lint     # Check for errors
```

### Useful Scripts

```bash
npx tsx scripts/validate-themes.ts   # Validate data references
npx tsx scripts/check_links.ts       # Check for broken links
```

---

## Content Structure

All content is stored as JSON in `src/data/`:

```
src/data/
├── lab-info.json       # Lab name, mission, PI info
├── people-index.json   # Who's in which category (PI, PhD, undergrad, etc.)
├── profiles/           # Individual profile files
│   ├── lag.json
│   ├── jane_doe.json
│   └── ...
├── publications.json   # All publications
├── projects.json       # Funded research projects
├── themes.json         # Research themes/areas
├── courses.json        # Courses taught
└── news.json           # News items
```

Images live in `/public/images/`:

```
public/images/
├── team/              # Headshots
├── news/              # News article images
├── themes/            # Research theme hero images
├── projects/          # Project images
└── iotrust-logo.png   # Lab logo
```

---

## Adding Content

### New Team Member

1. Create `src/data/profiles/<id>.json`:
   ```json
   {
     "id": "new_person",
     "name": "New Person",
     "role": "PhD Student",
     "email": "new.person@utah.edu",
     "image": "/images/team/new-person.jpg",
     "type": "json"
   }
   ```

2. Add to `src/data/people-index.json` under the right category:
   ```json
   "phdStudents": [
     { "id": "new_person", "type": "json" }
   ]
   ```

3. Add headshot to `/public/images/team/new-person.jpg`

### New Publication

Add to `src/data/publications.json`:

```json
{
  "id": "unique-pub-id",
  "title": "Paper Title",
  "authors": ["Author One", "Author Two"],
  "venue": "Conference/Journal Name",
  "year": 2024,
  "type": "conference",
  "doi": "https://doi.org/..."
}
```

### New News Item

Add to `src/data/news.json`:

```json
{
  "id": "news-url-slug",
  "title": "News Title",
  "date": "2024-03-15",
  "summary": "Brief description.",
  "tags": ["Award", "Publication"],
  "image": "/images/news/news-image.jpg"
}
```

Add the image to `/public/images/news/`.

---

## Deployment

The site automatically deploys to GitHub Pages when you push to `main`.

1. Make changes
2. Test locally with `npm run dev`
3. Commit and push
4. Wait ~2 minutes for GitHub Actions to deploy
5. Check https://iotrustlab.com

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Hosting:** GitHub Pages
- **Domain:** iotrustlab.com

---

## Need Help?

- Check existing profiles in `src/data/profiles/` for examples
- Run `npm run dev` to test changes locally before pushing
- Ask in the lab Slack if you're stuck
