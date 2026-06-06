'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Mail } from 'lucide-react';
import { decodeEmailAddress } from '@/lib/email-obfuscation';

type ObfuscatedEmailLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  encodedEmail: string;
  subject?: string;
  showAddress?: boolean;
  label?: string;
  icon?: boolean;
  iconClassName?: string;
  suffix?: ReactNode;
  children?: ReactNode;
};

export function ObfuscatedEmailLink({
  encodedEmail,
  subject,
  showAddress = false,
  label = 'Email',
  icon = false,
  iconClassName = 'h-4 w-4',
  suffix,
  children,
  ...props
}: ObfuscatedEmailLinkProps) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(decodeEmailAddress(encodedEmail));
  }, [encodedEmail]);

  const href = useMemo(() => {
    if (!email) return undefined;

    const params = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    return `mailto:${email}${params}`;
  }, [email, subject]);

  return (
    <a href={href} {...props}>
      {children ?? (
        <>
          {icon ? <Mail className={iconClassName} aria-hidden="true" /> : null}
          {showAddress ? email || label : label}
          {suffix}
        </>
      )}
    </a>
  );
}
