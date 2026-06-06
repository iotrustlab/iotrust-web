# Assets And Media

Before adding or replacing images, PDFs, or generated media, create a PR branch from the latest `main`:

```bash
git switch main
git pull
git switch -c update-site-assets
git branch --show-current   # should not print "main"
```

Do not add assets directly on `main`. See [pull-request-workflow.md](pull-request-workflow.md) for the full flow.

Images, PDFs, and generated social images live under `public/`. Anything in `public/` can be served by the website.

## Asset Locations

| Asset type | Folder |
| --- | --- |
| Team photos | `public/images/team/` |
| Pet photos | `public/images/team/pets/` |
| News images | `public/images/news/` |
| Theme images | `public/images/themes/` |
| Project images | `public/images/projects/` |
| Social/Open Graph images | `public/images/social/` |
| Public PDFs | `public/docs/` |

## Path Format

JSON files should use root-relative paths:

```json
"/images/team/jane-doe.jpg"
```

Not:

```json
"images/team/jane-doe.jpg"
"../images/team/jane-doe.jpg"
```

The asset path helper intentionally accepts only root-relative paths or full `http://`/`https://` URLs.

## Naming

Use simple lowercase names:

```text
jane-doe.jpg
smartsp-2025-demo.jpg
fig-hytwin-framework.png
```

Avoid spaces and punctuation-heavy names.

## Image Recommendations

Profile photos:

- Square or portrait-friendly crop.
- At least 400x400 px.
- Final site asset should be compressed, not a raw camera original.

News images:

- Landscape images usually work best.
- Use `imageLayout: "portrait"` in `news.json` for portrait images.

Project figures:

- Use PNG for diagrams.
- Use JPG for photographs.
- Keep captions clear and public-safe.

Theme images:

- Theme cards use visual assets heavily.
- Keep contrast readable in both light and dark mode.
- Check `/` and `/research` after changing theme images.

## PDFs And Downloads

Put public PDFs under:

```text
public/docs/
```

Reference them with:

```json
"/docs/projects/example/example-report.pdf"
```

Only publish files that are meant to be public.

## Social Images

The site uses generated Open Graph images under:

```text
public/images/social/
```

Generate them with:

```bash
npm run generate:og
```

This runs automatically before `npm run build`.

## Check Assets

```bash
npm run lint:links
```

This catches missing image paths in major data files.

If an image still does not appear:

- Confirm the exact file extension.
- Confirm the path starts with `/`.
- Confirm the file is inside `public/`.
- Restart `npm run dev` if the dev server looks stale.
