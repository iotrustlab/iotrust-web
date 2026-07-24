import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  Cpu,
  ExternalLink,
  Factory,
  GraduationCap,
  Handshake,
  Mail,
  MapPin,
  RadioTower,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { TeamMemberCard } from '@/components/team-member-card';
import LogoMark from '@/components/logo-mark';
import { ObfuscatedEmailLink } from '@/components/obfuscated-email-link';
import { MobileThemeAccordion } from '@/components/mobile-theme-accordion';
import type { Course, FurryMember, Person, Publication } from '@/lib/data';
import { getCourses, getLabInfo, getPublications, getPrincipalInvestigator, getCurrentTeam, getFurryMembers, getAlumni } from '@/lib/data';
import { encodeEmailAddress } from '@/lib/email-obfuscation';
import { withBasePath } from '@/lib/with-base-path';
import news from '@/data/news.json';
import themes from '@/data/themes.json';
import projects from '@/data/projects.json';

type ThemeVisualConfig = {
  accent: string;
  background: string;
  lightBackground: string;
  grid: string;
  lightGrid: string;
  Icon: LucideIcon;
  label: string;
  pills: string[];
  variant: 'circuit' | 'twin' | 'sensor' | 'brain' | 'industrial';
};

const themeVisuals: Record<string, ThemeVisualConfig> = {
  'cps-security-semantics': {
    accent: '#d83e3e',
    background: '#102a3b',
    lightBackground: '#eef3f6',
    grid: 'rgba(148, 190, 214, 0.10)',
    lightGrid: 'rgba(15, 42, 59, 0.055)',
    Icon: ShieldCheck,
    label: 'CPS Security',
    pills: ['Semantics', 'Testbeds', 'Resilience'],
    variant: 'circuit',
  },
  'digital-twins-verification': {
    accent: '#7c8df5',
    background: '#20284d',
    lightBackground: '#f0f1ff',
    grid: 'rgba(186, 197, 255, 0.10)',
    lightGrid: 'rgba(46, 56, 117, 0.055)',
    Icon: Cpu,
    label: 'Digital Twins',
    pills: ['Hybrid Models', 'Verification', 'Runtime Evidence'],
    variant: 'twin',
  },
  'iot-sensor-privacy': {
    accent: '#38b89d',
    background: '#123b35',
    lightBackground: '#e9f5f1',
    grid: 'rgba(166, 233, 219, 0.10)',
    lightGrid: 'rgba(18, 72, 62, 0.055)',
    Icon: RadioTower,
    label: 'Sensor Privacy',
    pills: ['IoT', 'Information Flow', 'Privacy'],
    variant: 'sensor',
  },
  'brain-centered-cps': {
    accent: '#a86bd5',
    background: '#332446',
    lightBackground: '#f4edf8',
    grid: 'rgba(215, 183, 239, 0.10)',
    lightGrid: 'rgba(82, 50, 107, 0.055)',
    Icon: Brain,
    label: 'NeuroIoT',
    pills: ['Neural Data', 'Multimodal Fusion', 'Human-in-the-loop'],
    variant: 'brain',
  },
  'digital-twinning-for-ics': {
    accent: '#e0a33a',
    background: '#342d1d',
    lightBackground: '#f6efe3',
    grid: 'rgba(244, 211, 143, 0.10)',
    lightGrid: 'rgba(84, 62, 25, 0.06)',
    Icon: Factory,
    label: 'ICS Twins',
    pills: ['ICS', 'Physics Models', 'Conformance'],
    variant: 'industrial',
  },
};

const fallbackThemeVisual: ThemeVisualConfig = {
  accent: '#d83e3e',
  background: '#182334',
  lightBackground: '#eef2f6',
  grid: 'rgba(203, 213, 225, 0.10)',
  lightGrid: 'rgba(15, 23, 42, 0.055)',
  Icon: ShieldCheck,
  label: 'Research Theme',
  pills: ['Security', 'Trust', 'Systems'],
  variant: 'circuit',
};

const opportunityTracks: Array<{ title: string; detail: string; Icon: LucideIcon }> = [
  {
    title: 'Prospective Students',
    detail: 'PhD and undergraduate researchers interested in CPS security, sensing, and autonomy.',
    Icon: GraduationCap,
  },
  {
    title: 'Postdoctoral Researchers',
    detail: 'Researchers ready to lead focused work across formal methods, testbeds, and trustworthy AI.',
    Icon: BookOpen,
  },
  {
    title: 'Visiting Scholars',
    detail: 'Short-term visits around shared systems problems, datasets, and experimental platforms.',
    Icon: Users,
  },
  {
    title: 'Research Collaborators',
    detail: 'Academic and industry partners building safer cyber-physical systems in real settings.',
    Icon: Handshake,
  },
];

function WireNode({ cx, cy, accent, muted = false }: { cx: number; cy: number; accent: string; muted?: boolean }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={muted ? 4 : 6}
      fill={muted ? 'var(--theme-node-muted)' : accent}
    />
  );
}

function ThemePattern({ variant, accent }: { variant: ThemeVisualConfig['variant']; accent: string }) {
  const dimStroke = 'var(--theme-pattern-strong)';
  const softStroke = 'var(--theme-pattern-soft)';
  const patternFill = 'var(--theme-pattern-fill)';

  if (variant === 'twin') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 300" aria-hidden="true">
        <path d="M72 104l58-34 58 34v76l-58 34-58-34Z" fill={patternFill} stroke={dimStroke} strokeWidth="2" />
        <path d="M130 70v76m-58-42 58 42 58-42M72 180l58-34 58 34" fill="none" stroke={softStroke} strokeWidth="2" />
        <path d="M242 104l58-34 58 34v76l-58 34-58-34Z" fill={patternFill} stroke={accent} strokeWidth="2.5" />
        <path d="M300 70v76m-58-42 58 42 58-42M242 180l58-34 58 34" fill="none" stroke={dimStroke} strokeWidth="2" />
        <path d="M188 118C214 86 230 86 242 118M188 168c28 34 54 34 82 0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        <path d="M120 238h180M90 250h226" fill="none" stroke={softStroke} strokeWidth="2" strokeLinecap="round" />
        <WireNode cx={130} cy={146} accent={accent} muted />
        <WireNode cx={300} cy={146} accent={accent} />
        <WireNode cx={214} cy={100} accent={accent} muted />
        <WireNode cx={214} cy={190} accent={accent} muted />
      </svg>
    );
  }

  if (variant === 'sensor') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 300" aria-hidden="true">
        <circle cx="210" cy="146" r="28" fill={patternFill} stroke={accent} strokeWidth="3" />
        <circle cx="210" cy="146" r="70" fill="none" stroke={dimStroke} strokeWidth="2" strokeDasharray="5 9" />
        <circle cx="210" cy="146" r="108" fill="none" stroke={softStroke} strokeWidth="2" />
        <path d="M210 146 92 84M210 146l128-38M210 146 96 218M210 146l120 66M210 146v-98M210 146v96" fill="none" stroke={dimStroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M86 68c70-46 150-48 240-6M94 242c78 42 158 42 240 0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M191 146l14 15 28-36" fill="none" stroke="var(--theme-pattern-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <WireNode cx={92} cy={84} accent={accent} muted />
        <WireNode cx={338} cy={108} accent={accent} muted />
        <WireNode cx={96} cy={218} accent={accent} muted />
        <WireNode cx={330} cy={212} accent={accent} muted />
        <WireNode cx={210} cy={48} accent={accent} />
        <WireNode cx={210} cy={242} accent={accent} />
      </svg>
    );
  }

  if (variant === 'brain') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 300" aria-hidden="true">
        <path d="M116 198c-30-18-42-46-36-82 8-46 46-70 92-62 18-32 66-34 92-8 38-13 78 8 88 48 42 5 64 40 55 80-9 38-44 60-91 55-33 30-88 31-121 1-24 12-50 10-79-32Z" fill={patternFill} stroke={dimStroke} strokeWidth="2.5" />
        <path d="M132 145c36-28 70-28 102 0s66 28 102 0M140 185c39 22 78 22 117 0M166 96c20 9 38 25 54 48M282 90c-24 18-42 42-54 72" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <path d="M122 232c64 28 148 30 250 8" fill="none" stroke={softStroke} strokeWidth="2" strokeLinecap="round" />
        <WireNode cx={166} cy={96} accent={accent} />
        <WireNode cx={220} cy={144} accent={accent} muted />
        <WireNode cx={282} cy={90} accent={accent} />
        <WireNode cx={140} cy={185} accent={accent} muted />
        <WireNode cx={336} cy={145} accent={accent} muted />
        <WireNode cx={256} cy={185} accent={accent} muted />
      </svg>
    );
  }

  if (variant === 'industrial') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 300" aria-hidden="true">
        <path d="M58 218h322M78 218V112l60 36v-36l62 36v-58h94v128" fill={patternFill} stroke={dimStroke} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M294 90V52h42v166M96 218v-56h48v56M176 218v-46h54v46" fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round" />
        <path d="M118 162h24M188 172h26M312 116h28M312 142h28M312 168h28" stroke={dimStroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M92 76h74c24 0 36 12 36 36v36M336 76h-46c-22 0-34 12-34 34v42" fill="none" stroke={softStroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M202 148c22-25 48-25 78 0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        <WireNode cx={92} cy={76} accent={accent} muted />
        <WireNode cx={202} cy={148} accent={accent} />
        <WireNode cx={280} cy={148} accent={accent} muted />
        <WireNode cx={336} cy={76} accent={accent} />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 300" aria-hidden="true">
      <rect x="70" y="74" width="118" height="74" rx="8" fill={patternFill} stroke={dimStroke} strokeWidth="2.5" />
      <rect x="244" y="152" width="114" height="78" rx="8" fill={patternFill} stroke={dimStroke} strokeWidth="2.5" />
      <path d="M104 98h42M104 120h64M276 176h48M276 198h30" stroke={dimStroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M188 110h44c20 0 30 10 30 30v52M128 148v42c0 20 10 30 30 30h84M128 74V48h116M302 152V92h58" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M72 232h290M92 248h248" stroke={softStroke} strokeWidth="2" strokeLinecap="round" />
      <WireNode cx={128} cy={148} accent={accent} />
      <WireNode cx={244} cy={48} accent={accent} muted />
      <WireNode cx={302} cy={152} accent={accent} />
      <WireNode cx={360} cy={92} accent={accent} muted />
      <WireNode cx={242} cy={220} accent={accent} muted />
    </svg>
  );
}

function ThemeCard({ theme }: { theme: { id: string; title: string; summary: string; projectIds: string[]; image?: string } }) {
  const visual = themeVisuals[theme.id] ?? fallbackThemeVisual;
  const Icon = visual.Icon;
  const themeVars = {
    '--theme-accent': visual.accent,
    '--theme-bg-light': visual.lightBackground,
    '--theme-bg-dark': visual.background,
    '--theme-grid-light': visual.lightGrid,
    '--theme-grid-dark': visual.grid,
  } as CSSProperties;

  return (
    <article
      className="group relative flex min-h-[156px] overflow-hidden rounded-lg border border-gray-200/85 bg-white text-gray-950 transition-colors hover:border-gray-300 dark:border-white/[0.09] dark:bg-[#0a0f19] dark:text-white dark:hover:border-white/20 md:min-h-[286px] lg:min-h-[318px] xl:min-h-[334px] [--theme-grid:var(--theme-grid-light)] [--theme-node-muted:rgb(15_23_42_/_0.12)] [--theme-pattern-fill:rgb(15_23_42_/_0.018)] [--theme-pattern-soft:rgb(15_23_42_/_0.045)] [--theme-pattern-strong:rgb(15_23_42_/_0.085)] [--theme-pattern-text:rgb(15_23_42_/_0.24)] dark:[--theme-grid:var(--theme-grid-dark)] dark:[--theme-node-muted:rgb(255_255_255_/_0.12)] dark:[--theme-pattern-fill:rgb(255_255_255_/_0.018)] dark:[--theme-pattern-soft:rgb(255_255_255_/_0.045)] dark:[--theme-pattern-strong:rgb(255_255_255_/_0.085)] dark:[--theme-pattern-text:rgb(255_255_255_/_0.34)]"
      style={themeVars}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,var(--theme-bg-light)_0%,rgb(255_255_255)_48%,rgb(255_255_255)_100%)] opacity-70 dark:bg-[linear-gradient(135deg,var(--theme-bg-dark)_0%,#0a0f19_50%,#0a0f19_100%)] dark:opacity-80" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--theme-grid)_1px,transparent_1px),linear-gradient(90deg,var(--theme-grid)_1px,transparent_1px)] bg-[length:44px_44px] opacity-45 dark:opacity-55"
      />
      <div className="pointer-events-none absolute -right-20 -top-10 h-[72%] w-[86%] opacity-[0.22] transition-opacity group-hover:opacity-[0.28] dark:opacity-[0.24] dark:group-hover:opacity-[0.30] sm:-right-24 sm:-top-12">
        <ThemePattern variant={visual.variant} accent={visual.accent} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[74%] bg-[linear-gradient(180deg,transparent_0%,rgb(255_255_255_/_0.90)_30%,rgb(255_255_255)_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgb(10_15_25_/_0.88)_30%,#0a0f19_100%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-[var(--theme-accent)] opacity-75 transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-[var(--theme-accent)] transition-opacity group-hover:opacity-35" />

      <details
        name="homepage-research-themes"
        data-theme-accordion-item
        className="group/details relative z-10 min-h-[156px] w-full p-4 pl-5 md:hidden"
      >
        <summary className="flex min-h-[124px] cursor-pointer list-none flex-col outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0a0f19] [&::-webkit-details-marker]:hidden">
          <div className="flex items-start justify-between gap-4">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.20em] text-[var(--theme-accent)] dark:text-[var(--theme-accent)] sm:text-[0.72rem]">
              {visual.label}
            </span>
            <Icon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[var(--theme-accent)] dark:text-gray-500" aria-hidden="true" />
          </div>

          <div className="mt-auto max-w-2xl pt-7">
            <div className="grid grid-cols-[minmax(0,1fr)_1.75rem] items-center gap-3">
              <h3 className="min-w-0 text-xl font-semibold leading-[1.16] text-gray-950 dark:text-white">
                {theme.title}
              </h3>
              <span className="grid h-7 w-7 translate-y-px place-items-center rounded-full border border-gray-950/10 bg-white/60 text-gray-600 shadow-[0_8px_24px_rgb(15_23_42_/_0.10)] backdrop-blur transition-all duration-200 group-hover/details:-translate-y-0.5 group-hover/details:border-[var(--theme-accent)] group-hover/details:text-[var(--theme-accent)] group-open/details:border-[var(--theme-accent)] group-open/details:bg-[var(--theme-accent)] group-open/details:text-white dark:border-white/15 dark:bg-white/[0.055] dark:text-gray-300 dark:shadow-none dark:group-open/details:text-[#0a0f19]">
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-open/details:rotate-180" aria-hidden="true" />
              </span>
              <span className="sr-only">Toggle details for {theme.title}</span>
            </div>
          </div>
        </summary>

        <div className="hidden max-w-2xl group-open/details:block">
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visual.pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-gray-950/[0.045] px-2.5 py-1 text-[0.7rem] font-medium text-gray-700 dark:bg-white/[0.06] dark:text-gray-300"
              >
                {pill}
              </span>
            ))}
          </div>
          <p className="mt-3 line-clamp-4 text-[0.93rem] leading-6 text-gray-600 dark:text-gray-300 sm:text-[0.96rem] sm:leading-[1.65] lg:line-clamp-5">
            {theme.summary}
          </p>
          <Link href={`/research#${theme.id}`} className="mt-5 inline-flex min-h-8 w-fit items-center text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-200 dark:hover:text-white">
            Explore theme →
          </Link>
        </div>
      </details>

      <div className="relative z-10 hidden min-h-[286px] w-full flex-col p-5 pl-6 md:flex lg:min-h-[318px] lg:p-6 lg:pl-7 xl:min-h-[334px]">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.20em] text-[var(--theme-accent)] dark:text-[var(--theme-accent)]">
            {visual.label}
          </span>
          <Icon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[var(--theme-accent)] dark:text-gray-500" aria-hidden="true" />
        </div>

        <div className="mt-auto max-w-2xl pt-10 lg:pt-14">
          <div className="mb-3 flex flex-wrap gap-1.5 lg:mb-4">
            {visual.pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-gray-950/[0.045] px-2.5 py-1 text-[0.7rem] font-medium text-gray-700 dark:bg-white/[0.06] dark:text-gray-300"
              >
                {pill}
              </span>
            ))}
          </div>
          <h3 className="text-[1.34rem] font-semibold leading-[1.16] text-gray-950 dark:text-white lg:text-[1.48rem]">
            {theme.title}
          </h3>
          <p className="mt-2.5 line-clamp-4 max-w-xl text-[0.92rem] leading-[1.58] text-gray-600 dark:text-gray-300 lg:mt-3 lg:line-clamp-5 lg:text-[0.96rem] lg:leading-[1.65]">
            {theme.summary}
          </p>
          <Link href={`/research#${theme.id}`} className="mt-4 inline-flex min-h-8 w-fit items-center text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-200 dark:hover:text-white lg:mt-5">
            Explore theme →
          </Link>
        </div>
      </div>
    </article>
  );
}

function ThemesPreview() {
  return (
    <section id="research" className="mx-auto max-w-7xl scroll-mt-24 space-y-6 px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
          Research Themes
        </p>
        <Link href="/research" className="text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200">View all themes →</Link>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {themes.map((t) => <ThemeCard key={t.id} theme={t} />)}
      </div>
      <MobileThemeAccordion />
    </section>
  );
}

function ProjectsPreview() {
  const featuredProjects = projects
    .filter((project) => project.status === 'active')
    .slice(0, 4);

  if (!featuredProjects.length) return null;

  return (
    <section id="projects" className="scroll-mt-24 bg-white py-14 dark:bg-gray-900 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
            Projects
          </h2>
          <Link
            href="/projects"
            className="text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
          >
            View all projects →
          </Link>
        </div>

        <div className="grid gap-x-10 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className="group border-b border-gray-200 py-7 dark:border-white/10"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700 dark:bg-brand-600/15 dark:text-brand-200">
                  {project.agency}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-white/[0.07] dark:text-gray-300">
                  {project.years}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-tight text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200 sm:text-2xl">
                {project.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                {project.abstract}
              </p>
              <Link
                href={`/research/${project.id}`}
                className="mt-5 inline-flex items-center text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
              >
                Project details
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesPreview({ courses }: { courses: Course[] }) {
  if (!courses.length) return null;

  return (
    <section id="courses" className="scroll-mt-24 border-t border-gray-200 bg-white py-14 dark:border-white/10 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
              Courses
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
              Teaching
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
          >
            View all courses →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <article
              key={course.id}
              className="rounded-lg bg-gray-50 p-5 transition-colors hover:bg-gray-100 dark:bg-white/[0.045] dark:hover:bg-white/[0.065]"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                  {course.code}
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-white/[0.08] dark:text-gray-300">
                  {course.level}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-950 dark:text-white">
                {course.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {course.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.terms.slice(0, 2).map((term) => (
                  <span
                    key={term}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/[0.08] dark:text-gray-300"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function RecentNews() {
  const items = [...news].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
  if (!items.length) return null;
  const [lead, ...briefs] = items;
  const leadImageIsPortrait =
    (lead as { imageLayout?: string }).imageLayout === 'portrait';
  const cover = lead as { coverKicker?: string; coverLabel?: string; coverCredit?: string };

  return (
    <section id="news" className="scroll-mt-24 border-y border-gray-200 bg-[#fbfbfa] dark:border-white/10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="border-y-2 border-gray-950 py-4 dark:border-white/85">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                Latest News
              </p>
              <h2 className="mt-1 font-serif text-4xl font-semibold leading-none text-gray-950 sm:text-5xl dark:text-white">
                IOTrust Dispatch
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>{formatNewsDate(lead.date)}</span>
              <Link href="/news" className="text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200">
                View all news →
              </Link>
            </div>
          </div>
        </div>

        <div
          className={
            lead.image
              ? 'grid gap-8 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]'
              : 'grid gap-8 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]'
          }
        >
          {lead.image && leadImageIsPortrait ? (
            <Link
              href={`/news/${lead.id}`}
              className="group grid overflow-hidden border-y border-gray-300 text-inherit transition-colors hover:border-brand-300 dark:border-white/15 dark:hover:border-brand-500 lg:grid-cols-[minmax(220px,0.58fr)_minmax(0,1fr)]"
            >
              <figure className="relative min-h-[320px] overflow-hidden bg-gray-100 dark:bg-white/[0.055] sm:min-h-[390px] lg:min-h-[500px]">
                <Image
                  src={withBasePath(lead.image)}
                  alt={lead.title}
                  fill
                  className={leadImageIsPortrait ? 'object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]' : 'object-cover transition-transform duration-500 group-hover:scale-[1.03]'}
                  sizes="(max-width: 1024px) 100vw, 28rem"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.78)_100%)]" />
                {cover.coverKicker || cover.coverLabel || cover.coverCredit ? (
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                    {cover.coverKicker ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200">
                        {cover.coverKicker}
                      </p>
                    ) : null}
                    {cover.coverLabel ? (
                      <p className="mt-1 text-base font-semibold leading-tight">
                        {cover.coverLabel}
                      </p>
                    ) : null}
                    {cover.coverCredit ? (
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
                        {cover.coverCredit}
                      </p>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>

              <div className="flex flex-col border-t border-gray-300 bg-[#fbfbfa] p-5 dark:border-white/15 dark:bg-gray-950 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                    Front Page
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{formatNewsDate(lead.date)}</span>
                </div>
                <h3 className="mt-5 font-serif text-3xl font-semibold leading-tight text-gray-950 group-hover:text-brand-700 sm:text-5xl lg:text-4xl xl:text-5xl dark:text-white dark:group-hover:text-brand-200">
                  {lead.title}
                </h3>
                <p className="mt-5 text-lg leading-8 text-gray-700 dark:text-gray-300 xl:text-xl xl:leading-9">
                  {lead.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {lead.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center pt-8 text-base font-semibold text-brand-600 dark:text-brand-300">
                  Read front story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : lead.image ? (
            <Link href={`/news/${lead.id}`} className="group block text-inherit">
              <figure className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-300 transition-colors group-hover:ring-brand-300 dark:bg-white/[0.055] dark:ring-white/15 dark:group-hover:ring-brand-500">
                <Image
                  src={withBasePath(lead.image)}
                  alt={lead.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 46rem"
                />
              </figure>
              {cover.coverKicker || cover.coverCredit ? (
                <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-gray-200 pb-3 text-xs dark:border-white/10">
                  {cover.coverKicker ? (
                    <span className="font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                      {cover.coverKicker}
                    </span>
                  ) : null}
                  {cover.coverCredit ? (
                    <span className="uppercase tracking-[0.14em] text-gray-500 dark:text-gray-500">
                      {cover.coverCredit}
                    </span>
                  ) : null}
                </figcaption>
              ) : null}
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                    Front Page
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{formatNewsDate(lead.date)}</span>
                </div>
                <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight text-gray-950 group-hover:text-brand-700 sm:text-4xl xl:text-5xl dark:text-white dark:group-hover:text-brand-200">
                  {lead.title}
                </h3>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700 dark:text-gray-300 xl:text-xl xl:leading-9">
                  {lead.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {lead.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center text-base font-semibold text-brand-600 dark:text-brand-300">
                  Read front story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href={`/news/${lead.id}`}
              className="group border-b border-gray-300 pb-8 transition-colors hover:border-brand-300 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8 dark:border-white/15 dark:hover:border-brand-500"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                  Front Page
                </span>
                <span className="text-gray-500 dark:text-gray-400">{formatNewsDate(lead.date)}</span>
              </div>
              <h3 className="mt-5 max-w-3xl font-serif text-3xl font-semibold leading-tight text-gray-950 group-hover:text-brand-700 sm:text-5xl dark:text-white dark:group-hover:text-brand-200">
                {lead.title}
              </h3>
              <p className="mt-5 max-w-3xl text-xl leading-9 text-gray-700 dark:text-gray-300">
                {lead.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {lead.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          )}

          <div className="space-y-0">
            {briefs.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group block border-b border-gray-200 py-5 first:pt-0 last:border-b-0 last:pb-0 dark:border-white/10"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                    {item.tags[0] ?? 'News'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{formatNewsDate(item.date)}</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-gray-950 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function publicationTypeLabel(type: Publication['type']) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function compactVenue(publication: Publication) {
  if (publication.venue.includes('IEEE/IFIP International Conference on Dependable Systems and Networks')) {
    return `IEEE/IFIP DSN ${publication.year}`;
  }

  if (publication.venue.includes('ACM/IEEE') && publication.venue.includes('Cyber-Physical Systems')) {
    return `ACM/IEEE ICCPS ${publication.year}`;
  }

  if (publication.venue.includes('NASA Formal Methods')) {
    return `NASA Formal Methods ${publication.year}`;
  }

  if (publication.venue.includes('arXiv')) {
    return `arXiv ${publication.year}`;
  }

  return publication.venue;
}

function publicationThemeLabels(publication: Publication) {
  return (publication.themeIds ?? [])
    .map((themeId) => themeVisuals[themeId]?.label ?? themes.find((theme) => theme.id === themeId)?.title)
    .filter(Boolean)
    .slice(0, 2) as string[];
}

type AuthorProfile = Pick<Person, 'id' | 'name'>;

function cleanAuthorName(name: string) {
  return name
    .replace(/\$\^[^$]+\$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function authorNameKeys(name: string) {
  const normalized = cleanAuthorName(name)
    .replace(/\b(dr|prof|professor)\.?\s+/gi, '')
    .replace(/[^a-zA-Z\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const parts = normalized.split(' ').filter(Boolean);
  const withoutInitials = parts.filter((part) => part.length > 1);
  const keys = new Set<string>();

  if (parts.length) {
    keys.add(parts.join(' '));
  }

  if (parts.length >= 2) {
    keys.add(`${parts[0]} ${parts[parts.length - 1]}`);
  }

  if (withoutInitials.length >= 2) {
    keys.add(`${withoutInitials[0]} ${withoutInitials[withoutInitials.length - 1]}`);
  }

  return Array.from(keys);
}

function buildAuthorProfileMap(profiles: AuthorProfile[]) {
  const map = new Map<string, AuthorProfile>();

  for (const profile of profiles) {
    for (const key of authorNameKeys(profile.name)) {
      map.set(key, profile);
    }
  }

  return map;
}

function AuthorList({
  authors,
  authorProfileMap,
}: {
  authors: string[];
  authorProfileMap: Map<string, AuthorProfile>;
}) {
  const visibleAuthors = authors.length > 5 ? authors.slice(0, 4) : authors;

  return (
    <span>
      {visibleAuthors.map((author, index) => {
        const displayName = cleanAuthorName(author);
        const profile = authorNameKeys(author)
          .map((key) => authorProfileMap.get(key))
          .find(Boolean);

        return (
          <span key={`${author}-${index}`}>
            {index > 0 ? ', ' : ''}
            {profile ? (
              <Link
                href={`/people/${profile.id}/`}
                className="font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-500 dark:text-gray-200 dark:decoration-white/25 dark:hover:text-brand-200 dark:hover:decoration-brand-300"
              >
                {displayName}
              </Link>
            ) : (
              displayName
            )}
          </span>
        );
      })}
      {authors.length > visibleAuthors.length ? (
        <span>, +{authors.length - visibleAuthors.length} more</span>
      ) : null}
    </span>
  );
}

function PublicationIndexRow({
  publication,
  authorProfileMap,
}: {
  publication: Publication;
  authorProfileMap: Map<string, AuthorProfile>;
}) {
  const themeLabels = publicationThemeLabels(publication);
  const externalLabel = publication.url?.includes('doi.org') ? 'DOI' : 'Paper';

  return (
    <article className="group relative grid gap-4 overflow-hidden rounded-lg px-4 py-4 transition-colors hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-white/[0.045] dark:focus-within:bg-white/[0.045] sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[7rem_minmax(0,1fr)_2.75rem]">
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-0 top-4 w-px rounded-full bg-gray-200 transition-all duration-300 group-hover:w-1 group-hover:bg-brand-500 group-focus-within:w-1 group-focus-within:bg-brand-500 dark:bg-white/15 dark:group-hover:bg-brand-400 dark:group-focus-within:bg-brand-400"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_50%,rgba(214,59,59,0.12),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-[radial-gradient(circle_at_0_50%,rgba(239,103,103,0.13),transparent_42%)]"
      />

      <div className="relative z-10 flex items-center gap-3 sm:block">
        <span className="block text-base font-semibold tabular-nums text-gray-900 dark:text-white">
          {publication.year}
        </span>
        <span className="mt-2 block w-fit rounded-full bg-gray-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:bg-white/[0.07] dark:text-gray-400">
          {publicationTypeLabel(publication.type)}
        </span>
      </div>

      <div className="relative z-10 min-w-0">
        <Link
          href="/publications"
          className="block max-w-5xl text-lg font-semibold leading-snug text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200 sm:text-xl"
        >
          {publication.title}
        </Link>

        <p className="mt-2 text-[0.95rem] leading-7 text-gray-700 dark:text-gray-300">
          <AuthorList authors={publication.authors} authorProfileMap={authorProfileMap} />
        </p>

        <p className="mt-1.5 max-w-4xl text-sm leading-6 text-gray-500 dark:text-gray-400">
          {compactVenue(publication)}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          {themeLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/[0.08] dark:text-gray-300"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {publication.url ? (
        <a
          href={publication.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${externalLabel}`}
          className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:border-brand-300 hover:bg-white hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-white/10 dark:text-gray-300 dark:hover:border-brand-400 dark:hover:bg-white/[0.08] dark:hover:text-brand-200"
        >
          <span className="sr-only">Open {externalLabel}</span>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
    </article>
  );
}

function PublicationsIndex({
  publications,
  authorProfiles,
}: {
  publications: Publication[];
  authorProfiles: AuthorProfile[];
}) {
  const items = publications.slice(0, 4);
  const authorProfileMap = buildAuthorProfileMap(authorProfiles);

  if (!items.length) return null;

  return (
    <section id="publications" className="scroll-mt-24 bg-white py-10 dark:bg-gray-900 sm:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold leading-tight text-gray-950 dark:text-white sm:text-3xl">
            Recent Publications
          </h2>
          <Link
            href="/publications"
            className="text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
          >
            Browse all publications →
          </Link>
        </div>

        <div className="mt-5 space-y-1">
          {items.map((publication) => (
            <PublicationIndexRow
              key={publication.id}
              publication={publication}
              authorProfileMap={authorProfileMap}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function firstNameForSort(name: string) {
  const parts = name
    .replace(/\b(dr|prof|professor)\.?\s+/gi, '')
    .split(/\s+/)
    .filter(Boolean);

  return parts[0] ?? name;
}

function byFirstName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const firstNameCompare = firstNameForSort(a.name).localeCompare(firstNameForSort(b.name));

    return firstNameCompare || a.name.localeCompare(b.name);
  });
}

function PeopleGroup({ title, members }: { title: string; members: Person[] }) {
  if (!members.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="shrink-0 text-lg font-semibold text-gray-950 dark:text-white sm:text-xl">
          {title}
        </h3>
        <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" aria-hidden="true" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} variant="homepage" />
        ))}
      </div>
    </section>
  );
}

function FurryMemberCard({ member }: { member: FurryMember }) {
  const hasImage = Boolean(member.image);
  const primaryMeta = member.title ?? member.role;
  const secondaryMeta = member.title ? member.role : null;
  const initials = member.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="grid h-full grid-cols-[6.5rem_minmax(0,1fr)] gap-4 rounded-lg bg-gray-100/70 p-3 transition-colors hover:bg-gray-100 dark:bg-white/[0.045] dark:hover:bg-white/[0.065] sm:grid-cols-[7.25rem_minmax(0,1fr)]">
      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        {hasImage ? (
          <Image
            src={withBasePath(member.image)}
            alt={member.name}
            fill
            className="object-cover object-[50%_30%]"
            sizes="8rem"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-tight">
            {initials}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center py-1">
        <h4 className="text-lg font-semibold leading-snug text-gray-950 dark:text-white">
          {member.name}
        </h4>
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">
          {primaryMeta}
        </p>
        {secondaryMeta ? (
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {secondaryMeta}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {member.description}
        </p>
      </div>
    </article>
  );
}

export default async function HomePage() {
  const [labInfo, recentPublications, principalInvestigator, currentTeam, furryMembers, alumni, courses] = await Promise.all([
    getLabInfo(),
    getPublications(),
    getPrincipalInvestigator(),
    getCurrentTeam(),
    getFurryMembers(),
    getAlumni(),
    getCourses()
  ]);
  const heroFocusAreas = labInfo.focus_areas.slice(0, 5);
  const publicationAuthorProfiles = [...principalInvestigator, ...currentTeam, ...alumni];
  const sortedPrincipalInvestigator = byFirstName(principalInvestigator);
  const postdocs = byFirstName(currentTeam.filter((m) => m.role.toLowerCase().includes('postdoc')));
  const phdStudents = byFirstName(currentTeam.filter((m) => m.role.toLowerCase().includes('phd')));
  const mastersStudents = byFirstName(currentTeam.filter((m) => m.role.toLowerCase().includes('master')));
  const undergrads = byFirstName(
    currentTeam.filter((m) => {
      const role = m.role.toLowerCase();
      return role.includes('undergrad') || role.includes('undergraduate');
    })
  );
  const interns = byFirstName(
    currentTeam.filter((m) => m.role.toLowerCase().includes('intern'))
  );
  const sortedAlumni = byFirstName(alumni);
  const encodedLeadEmail = encodeEmailAddress(labInfo.lead.email);

  return (
    <div className="bg-white dark:bg-gray-900">
      <section id="home" className="relative isolate overflow-hidden bg-white text-gray-950 dark:bg-[#070b10] dark:text-white">
        <Image
          src={withBasePath("/images/projects/ncs/hero.jpg")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_38%] opacity-[0.42] saturate-[0.9] dark:opacity-75 dark:saturate-[0.86]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_42%,rgba(255,255,255,0.68)_78%,rgba(255,255,255,0.88)_100%)] dark:bg-[linear-gradient(90deg,rgba(7,11,16,0.97)_0%,rgba(7,11,16,0.9)_42%,rgba(7,11,16,0.63)_78%,rgba(7,11,16,0.88)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.28)_44%,rgba(255,255,255,0.98)_100%)] dark:bg-[linear-gradient(180deg,rgba(7,11,16,0.68)_0%,rgba(7,11,16,0.12)_44%,rgba(7,11,16,0.92)_100%)]" />

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="mb-10 hidden sm:block sm:mb-12">
              <LogoMark size={58} variant="light" className="dark:hidden" />
              <LogoMark size={58} variant="dark" className="hidden dark:block" />
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700 sm:mb-5 sm:text-sm dark:text-brand-300">
              University of Utah research lab
            </p>

            <h1 className="text-4xl font-semibold leading-[0.98] text-gray-950 sm:text-5xl lg:text-7xl dark:text-white">
              IOTrust Lab
            </h1>

            <p className="mt-5 max-w-3xl text-[1.42rem] font-semibold leading-[1.22] text-gray-950 sm:mt-6 sm:text-3xl sm:leading-tight lg:text-4xl dark:text-white">
              Trustworthy autonomy starts with systems we can explain, test, and defend.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-700 sm:mt-6 sm:text-xl sm:leading-8 lg:text-2xl lg:leading-9 dark:text-white/80">
              We connect semantic reasoning, digital twins, human-centered sensing, and real CPS
              testbeds into practical evidence for autonomous systems.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
              <a
                href="#research"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-600 px-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
              >
                Explore Research
              </a>
              <a
                href="#publications"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-gray-300 bg-white/75 px-5 text-base font-semibold text-gray-950 transition-colors hover:border-brand-300 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.12] dark:focus-visible:outline-white"
              >
                View Publications →
              </a>
            </div>
          </div>

          <aside className="hidden rounded-lg border border-gray-200/80 bg-white/[0.82] p-5 shadow-xl shadow-gray-900/10 backdrop-blur-md dark:border-white/[0.14] dark:bg-[#0b1118]/[0.78] dark:shadow-2xl sm:p-6 lg:block">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-white/[0.12]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-white/70">
                Focus Areas
              </p>
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-600/20 dark:text-brand-200 dark:ring-brand-400/30">
                {heroFocusAreas.length}
              </span>
            </div>

            <div className="mt-3 divide-y divide-gray-200 dark:divide-white/10">
              {heroFocusAreas.map((area, index) => (
                <Link
                  key={area}
                  href="/research"
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 py-4 transition-colors"
                >
                  <span className="text-base font-semibold tabular-nums text-brand-700 dark:text-brand-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lg font-semibold leading-7 text-gray-900 group-hover:text-brand-700 dark:text-white/90 dark:group-hover:text-brand-100">
                    {area}
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-5 border-t border-gray-200 pt-4 text-base leading-7 text-gray-600 dark:border-white/10 dark:text-white/60">
              Research spans field sensing, industrial controls, formal methods, and security
              experimentation.
            </p>
          </aside>
        </div>
      </section>

      {/* Research Themes Preview */}
      <ThemesPreview />

      <ProjectsPreview />

      {/* Recent News */}
      <RecentNews />

      <PublicationsIndex publications={recentPublications} authorProfiles={publicationAuthorProfiles} />

      <CoursesPreview courses={courses} />

      {/* Research Team */}
      <section id="people" className="scroll-mt-24 border-y border-gray-200 py-14 dark:border-white/10 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                People
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Research Team
              </h2>
            </div>
            <Link
              href="/people"
              className="text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              View all people →
            </Link>
          </div>

          {sortedPrincipalInvestigator.length > 0 && (
            <section className="mb-12 space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="shrink-0 text-lg font-semibold text-gray-950 dark:text-white sm:text-xl">
                  Principal Investigator
                </h3>
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" aria-hidden="true" />
              </div>
              <div className="w-full">
                {sortedPrincipalInvestigator.map((member) => (
                  <TeamMemberCard key={member.id} member={member} isPI={true} variant="homepage" />
                ))}
              </div>
            </section>
          )}

          <div className="space-y-12">
            <PeopleGroup title="Postdoctoral Researchers" members={postdocs} />
            <PeopleGroup title="PhD Students" members={phdStudents} />
            <PeopleGroup title="Master's Students" members={mastersStudents} />
            <PeopleGroup title="Undergraduate Researchers" members={undergrads} />
            <PeopleGroup title="Research Interns" members={interns} />
            <PeopleGroup title="Alumni" members={sortedAlumni} />
          </div>

          {furryMembers.length > 0 ? (
            <div className="mt-16 space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="shrink-0 text-lg font-semibold text-gray-950 dark:text-white sm:text-xl">
                  Furry Members
                </h3>
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" aria-hidden="true" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {furryMembers.map((member) => (
                  <FurryMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="scroll-mt-24 bg-white py-14 dark:bg-gray-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-9 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] xl:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                Opportunities
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Work With Us
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
                Share the research problem you want to work on, the systems you have built, and how it connects to trustworthy CPS.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ObfuscatedEmailLink
                  encodedEmail={encodedLeadEmail}
                  subject="Research Collaboration Inquiry"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-600 px-4 text-base font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  Email the lab
                </ObfuscatedEmailLink>
                <Link
                  href="/opportunities"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-gray-100 px-4 text-base font-semibold text-gray-950 transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-white/[0.07] dark:text-white dark:hover:bg-white/[0.11]"
                >
                  Open positions
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {opportunityTracks.map(({ title, detail, Icon }) => (
                <article
                  key={title}
                  className="rounded-lg bg-gray-50 p-5 transition-colors hover:bg-gray-100 dark:bg-white/[0.045] dark:hover:bg-white/[0.065]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-24 border-t border-gray-200 py-14 dark:border-white/10 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-9 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] xl:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                Contact
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Reach the Lab
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-lg bg-gray-50/80 p-5 ring-1 ring-gray-200 dark:bg-white/[0.045] dark:ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-200">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-950 dark:text-white">
                  {labInfo.lead.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {labInfo.lead.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {labInfo.university.department}, {labInfo.university.name}
                </p>
                <ObfuscatedEmailLink
                  encodedEmail={encodedLeadEmail}
                  showAddress
                  className="mt-4 inline-flex items-center text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  suffix={<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
                />
              </article>

              <article className="rounded-lg bg-gray-50/80 p-5 ring-1 ring-gray-200 dark:bg-white/[0.045] dark:ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-200">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-950 dark:text-white">
                  University of Utah
                </h3>
                <div className="mt-2 space-y-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  <p>{labInfo.university.department}</p>
                  <p>{labInfo.university.address.street}</p>
                  <p>
                    {labInfo.university.address.city}, {labInfo.university.address.state}{' '}
                    {labInfo.university.address.zip}
                  </p>
                </div>
                <a
                  href="/contact"
                  className="mt-4 inline-flex items-center text-base font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                >
                  Contact page
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
