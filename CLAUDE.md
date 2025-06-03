# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 academic research lab website using App Router with TypeScript and Tailwind CSS v4. The site showcases IoTrust Lab's research, team, and publications.

### Key Architecture Patterns

**Data Management**: The site uses a JSON-based data system located in `src/data/` with three content types:
- `native` - Pages rendered with Next.js App Router (e.g., `app/people/page.tsx`)
- `static` - Pre-built HTML files in `public/static/` for external content
- `json` - Dynamic content loaded from JSON profiles in `src/data/profiles/`

**Content Types**: People and projects are managed through `people-index.json` which references individual profile files and specifies their rendering type. The data layer in `src/lib/data.ts` handles loading and type resolution.

**Navigation**: Uses dual navigation system - native Next.js routing for main pages and dynamic routing for `[slug].tsx` pages that handle different content types.

**Component Structure**: 
- Site layout wraps all pages with navigation and footer
- Theme provider handles dark/light mode with next-themes
- Components follow shadcn/ui patterns with class-variance-authority for styling

**Image Handling**: Next.js Image component configured for placeholder.com remote patterns. Team and project images stored in `public/images/`.

### Important File Patterns

- `src/data/profiles/[id].json` - Individual person/project profiles
- `pages/[type]/[slug].tsx` - Dynamic routing for different content types
- `src/lib/data.ts` - Central data access layer with type safety
- `src/app/[section]/page.tsx` - Native Next.js pages

### TypeScript Configuration

Uses path aliases with `@/*` pointing to `src/*`. Strict mode enabled with Next.js plugin for enhanced type checking.