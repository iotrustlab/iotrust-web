# Pull Request Workflow

GitHub pull requests are the normal way to update the website. Avoid pushing directly to `main` unless you are explicitly doing a maintainer release.

## 1. Create A Branch

```bash
git switch main
git pull
git switch -c update-my-profile
git branch --show-current   # should not print "main"
```

Use a short branch name that describes the change:

```text
update-jainta-profile
add-smartsp-news
add-new-publication
refresh-project-images
```

## 2. Make The Change

Use the relevant section doc:

- [update profiles](update-profiles.md)
- [update research](update-research.md)
- [update news](update-news.md)
- [update publications](update-publications.md)
- [update courses and lab info](update-courses-and-lab-info.md)
- [assets and media](assets-and-media.md)

Preview locally with:

```bash
npm run dev
```

## 3. Run Checks

```bash
npm run lint
npm run lint:links
npx tsx scripts/validate-themes.ts
npm run build
```

If your change only edits docs, `npm run build` is still useful but less critical. For site content changes, run it.

## 4. Review Your Diff

```bash
git status
git diff
```

Make sure the diff contains only intended changes.

Do not include:

- `.DS_Store`
- local screenshots unless they are meant to become site assets
- private notes
- raw full-size images that are not used by the site
- secrets or credentials

## 5. Commit

Stage only the files you intentionally changed:

```bash
git add src/data/profiles/my_id.json public/images/team/my-photo.jpg
git commit -m "Update My Name profile"
```

Good commit messages:

```text
Update Sayom profile
Add SmartSP 2025 publication
Add KPCW interview news story
Refresh research theme images
```

## 6. Push And Open PR

```bash
git push -u origin update-my-profile
```

Open a pull request on GitHub.

In the PR description, include:

- What changed
- Which page(s) to review
- Whether you ran `npm run build`
- Any open questions

## PR Review Checklist

Before requesting review:

- The page renders locally.
- JSON is valid.
- Images load.
- Links go where expected.
- Text is factual and public-safe.
- `npm run build` passes for content or code changes.

## After Merge

GitHub Pages deploys from `main`. See [deployment.md](deployment.md) for the deployment flow.
