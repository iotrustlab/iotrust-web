import { Person } from '@/lib/data';
import { Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ObfuscatedEmailLink } from '@/components/obfuscated-email-link';
import { encodeEmailAddress } from '@/lib/email-obfuscation';
import { withBasePath } from '@/lib/with-base-path';

interface TeamMemberCardProps {
  member: Person;
  isPI?: boolean;
  variant?: 'default' | 'homepage';
}

function getInitials(name: string) {
  const parts = name
    .replace(/\b(dr|prof|professor)\.?\s+/gi, '')
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'IT';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function avatarStyle(name: string) {
  const palettes = [
    { background: '#d9a5a5', color: '#3b1111' },
    { background: '#a9cce8', color: '#102538' },
    { background: '#a8d8c6', color: '#0c2f26' },
    { background: '#c5addd', color: '#241238' },
    { background: '#e4c58d', color: '#35200a' },
  ];
  const hash = Array.from(name).reduce((total, char) => total + char.charCodeAt(0), 0);

  return palettes[hash % palettes.length];
}

function isPlaceholderImage(image?: string) {
  return !image || image.includes('profile-avatar-placeholder');
}

export function TeamMemberCard({ member, isPI = false, variant = 'default' }: TeamMemberCardProps) {
  const hasImage = !isPlaceholderImage(member.image);
  const avatarSize = isPI ? "w-36 h-36 md:w-40 md:h-40" : "w-24 h-24 md:w-28 md:h-28";
  const profileHref = `/people/${member.id}/`;
  const initials = getInitials(member.name);
  const initialsStyle = avatarStyle(member.name);
  const encodedEmail = encodeEmailAddress(member.email);

  if (variant === 'homepage') {
    const featured = isPI;

    return (
      <article className={`${featured ? 'grid gap-5 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:p-5' : 'grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 p-3'} group h-full w-full rounded-lg bg-gray-100/70 transition-colors hover:bg-gray-100 dark:bg-white/[0.045] dark:hover:bg-white/[0.065]`}>
        <Link
          href={profileHref}
          className={`${featured ? 'mx-auto aspect-square w-44 sm:w-full' : 'aspect-square w-full self-start'} block overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500`}
          aria-label={`View ${member.name}'s profile`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
              {hasImage ? (
                <Image
                  src={withBasePath(member.image!)}
                  alt={member.name}
                  fill
                  className="object-cover object-[50%_30%]"
                  sizes={featured ? '13rem' : '8rem'}
                />
              ) : (
                <div
                  className={`${featured ? 'text-5xl' : 'text-3xl'} flex h-full w-full items-center justify-center font-semibold tracking-tight`}
                  style={initialsStyle}
                  aria-hidden="true"
                >
                  {initials}
                </div>
              )}
          </div>
        </Link>

        <div className="flex min-w-0 flex-col">
          <Link
            href={profileHref}
            className={`${featured ? 'px-3 py-2 sm:px-5 sm:py-3' : 'px-2 py-1'} block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset`}
            aria-label={`View ${member.name}'s profile`}
          >
            {featured ? (
              <>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                {member.role}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 sm:text-3xl">
                {member.name}
              </h3>
              {member.title ? (
                <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {member.title}
                  {member.department ? `, ${member.department}` : ''}
                </p>
              ) : null}
              </>
            ) : (
              <>
              <h3 className="text-lg font-semibold leading-snug text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">
                {member.role}
              </p>
              {member.title ? (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {member.title}
                </p>
              ) : null}
              </>
            )}
          </Link>

          <div className={`${featured ? 'px-3 pb-2 sm:px-5' : 'px-2 pb-1'} mt-auto flex items-center justify-between`}>
            <Link
              href={profileHref}
              className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              Profile →
            </Link>
            <div className="flex items-center gap-3">
              <ObfuscatedEmailLink
                encodedEmail={encodedEmail}
                className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-300"
                title="Send email"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="h-4 w-4" />
              </ObfuscatedEmailLink>

              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-300"
                  title="Visit website"
                  aria-label={`Visit ${member.name}'s website`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }
  
  return (
    <article className="group mx-auto flex min-h-[330px] w-[260px] max-w-full flex-col rounded-lg border border-gray-200 bg-white p-5 text-center transition-colors hover:border-brand-200 hover:bg-gray-50/70 dark:border-white/10 dark:bg-gray-900 dark:hover:border-brand-700/60 dark:hover:bg-white/[0.035]">
      <Link
        href={profileHref}
        className="block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-gray-900"
        aria-label={`View ${member.name}'s profile`}
      >
        <div className="flex justify-center mb-5">
          <div className={`${avatarSize} relative flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-white/10`}>
            {hasImage ? (
              <Image
                src={withBasePath(member.image!)}
                alt={member.name}
                fill
                className="object-cover object-[50%_30%] rounded-full"
                sizes={isPI ? "10rem" : "7rem"}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-tight"
                style={initialsStyle}
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-base font-semibold leading-snug text-gray-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
          {member.name}
        </h3>
        
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">
          {member.role}
        </p>
        
        {member.title && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {member.title}
          </p>
        )}
        
        {member.research_interests && member.research_interests.length > 0 && (
          <div className="mt-4 flex-1">
            <div className="flex flex-wrap justify-center gap-1">
              {member.research_interests.slice(0, 2).map((interest) => (
                <span 
                  key={interest}
                  className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                >
                  {interest}
                </span>
              ))}
              {member.research_interests.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{member.research_interests.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
      
      <div className="mt-5 flex items-center justify-center gap-4 border-t border-gray-100 pt-4 dark:border-white/10">
        <Link
          href={profileHref}
          className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
        >
          Profile
        </Link>
        <ObfuscatedEmailLink
          encodedEmail={encodedEmail}
          className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-300"
          title="Send email"
          aria-label={`Email ${member.name}`}
        >
          <Mail className="h-4 w-4" />
        </ObfuscatedEmailLink>
        
        {member.website && (
          <a
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-300"
            title="Visit website"
            aria-label={`Visit ${member.name}'s website`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
} 
