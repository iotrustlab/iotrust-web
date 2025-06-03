# IoTrust Lab Website

A modern, responsive website for IoTrust Lab built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ **Modern Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- 🌙 **Dark/Light Mode**: Toggle between themes with local storage persistence
- 📱 **Responsive Design**: Fully responsive across all device sizes
- 🔍 **SEO Optimized**: Comprehensive SEO setup with next-seo
- ♿ **Accessible**: Built with accessibility best practices
- 🎨 **Beautiful UI**: Clean, modern design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── bio/             # Bio page
│   ├── research/        # Research page
│   ├── people/          # People page
│   ├── publications/    # Publications page
│   ├── opportunities/   # Opportunities page
│   ├── contact/         # Contact page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # Reusable UI components
│   ├── navigation.tsx   # Site navigation
│   ├── footer.tsx       # Site footer
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── layouts/            # Layout components
│   └── site-layout.tsx
├── config/             # Configuration files
│   └── seo.ts          # SEO configuration
├── data/               # Data files (for future use)
├── lib/                # Utility functions
└── styles/             # Additional styles (for future use)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with shadcn/ui setup
- **Icons**: Lucide React
- **SEO**: next-seo
- **Theming**: next-themes

## Phase 1 Completed ✅

- [x] Next.js project initialization with TypeScript
- [x] TailwindCSS and shadcn/ui setup
- [x] Project structure with proper folder organization
- [x] Site-wide layout with header and footer
- [x] Dark/light mode toggle with persistence
- [x] Responsive navigation with all sections
- [x] Basic SEO setup with next-seo
- [x] Placeholder pages for all routes

## Next Steps (Future Phases)

- Phase 2: Content management and dynamic pages
- Phase 3: Research showcase and publications
- Phase 4: Team profiles and contact forms
- Phase 5: Advanced features and optimizations

## License

This project is private and proprietary to IoTrust Lab.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
