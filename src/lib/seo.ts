import type { Metadata } from "next";

export const SITE_URL = "https://iotrustlab.com";
export const SITE_NAME = "IOTrust Lab";
export const SITE_LONG_NAME = "Trustworthy Cyber-physical Systems Lab";
export const SITE_DESCRIPTION =
  "IOTrust Lab at the University of Utah studies trustworthy cyber-physical systems, autonomous systems safety, formal methods, digital twins, IoT privacy, and resilient sensing.";

export const SOCIAL_IMAGES = {
  default: "/images/social/iotrust-lab-og.png",
  research: "/images/social/iotrust-research-og.png",
  news: "/images/social/iotrust-news-og.png",
  publications: "/images/social/iotrust-publications-og.png",
  mythosNews: "/images/social/iotrust-news-mythos-og.png",
};

export const SITE_KEYWORDS = [
  "IOTrust Lab",
  "University of Utah",
  "Kahlert School of Computing",
  "cyber-physical systems security",
  "CPS security",
  "formal methods",
  "digital twins",
  "industrial control systems security",
  "IoT privacy",
  "trustworthy autonomy",
  "NeuroIoT",
  "resilient sensing",
];

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();
}

export function canonicalPath(path = "/") {
  const [withoutHash] = path.split("#");
  const [pathname] = withoutHash.split("?");
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalized === "/") return "/";
  if (/\.[a-z0-9]+$/i.test(normalized)) return normalized;
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export function canonicalUrl(path = "/") {
  return absoluteUrl(canonicalPath(path));
}

function pageTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

export function createMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = SOCIAL_IMAGES.default,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: PageMetadataOptions = {}): Metadata {
  const canonical = canonicalUrl(path);
  const socialTitle = pageTitle(title);
  const socialImage = absoluteUrl(image);
  const sharedImage = {
    url: socialImage,
    width: 1200,
    height: 630,
    alt: imageAlt ?? socialTitle,
    type: "image/png",
  };

  return {
    title,
    description,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical,
    },
    openGraph:
      type === "article"
        ? {
            type: "article",
            locale: "en_US",
            url: canonical,
            siteName: SITE_NAME,
            title: socialTitle,
            description,
            images: [sharedImage],
            publishedTime,
            modifiedTime,
            authors,
            tags,
          }
        : {
            type: "website",
            locale: "en_US",
            url: canonical,
            siteName: SITE_NAME,
            title: socialTitle,
            description,
            images: [sharedImage],
          },
    twitter: {
      card: "summary_large_image",
      site: "@iotrustlab",
      creator: "@iotrustlab",
      title: socialTitle,
      description,
      images: [socialImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: SITE_LONG_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/images/iotrust-logo.png"),
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "50 Central Campus Dr",
    addressLocality: "Salt Lake City",
    addressRegion: "UT",
    postalCode: "84112",
    addressCountry: "US",
  },
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "University of Utah",
    url: "https://www.utah.edu/",
  },
  department: {
    "@type": "Organization",
    name: "Kahlert School of Computing",
    url: "https://www.cs.utah.edu/",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: SITE_LONG_NAME,
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

type PersonLike = {
  id: string;
  name: string;
  role: string;
  title?: string;
  bio?: string;
  image: string;
  website?: string;
  linkedin?: string;
  github?: string;
  google_scholar?: string;
  resume?: string;
  university?: string;
  department?: string;
};

export function personJsonLd(person: PersonLike) {
  const sameAs = [
    person.website,
    person.linkedin,
    person.github,
    person.google_scholar,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${canonicalUrl(`/people/${person.id}`)}#person`,
    name: person.name,
    url: canonicalUrl(`/people/${person.id}`),
    image: absoluteUrl(person.image),
    jobTitle: person.title ?? person.role,
    description: person.bio,
    sameAs,
    affiliation: {
      "@id": `${SITE_URL}/#organization`,
    },
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
    memberOf: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

type ArticleLike = {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
  image?: string;
  socialImage?: string;
};

export function articleJsonLd(article: ArticleLike) {
  const image = article.socialImage || article.image || SOCIAL_IMAGES.news;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${canonicalUrl(`/news/${article.id}`)}#article`,
    headline: article.title,
    description: article.summary,
    datePublished: `${article.date}T00:00:00.000Z`,
    dateModified: `${article.date}T00:00:00.000Z`,
    mainEntityOfPage: canonicalUrl(`/news/${article.id}`),
    image: [absoluteUrl(image)],
    keywords: article.tags,
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}
