import type { MetadataRoute } from "next";
import news from "@/data/news.json";
import peopleIndex from "@/data/people-index.json";
import projects from "@/data/projects.json";
import themes from "@/data/themes.json";
import { absoluteUrl, canonicalPath, SOCIAL_IMAGES } from "@/lib/seo";

export const dynamic = "force-static";

type SitemapRoute = {
  path: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
  images?: string[];
};

function route({
  path,
  lastModified = new Date(),
  changeFrequency = "monthly",
  priority = 0.7,
  images,
}: SitemapRoute): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(canonicalPath(path)),
    lastModified,
    changeFrequency,
    priority,
    images: images?.map(absoluteUrl),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const peopleRefs = [
    ...peopleIndex.principalInvestigator,
    ...peopleIndex.postdocs,
    ...peopleIndex.phdStudents,
    ...(peopleIndex.mastersStudents ?? []),
    ...peopleIndex.undergrads,
    ...peopleIndex.alumni,
  ];

  return [
    route({ path: "/", changeFrequency: "weekly", priority: 1, images: [SOCIAL_IMAGES.default] }),
    route({ path: "/research", changeFrequency: "monthly", priority: 0.9, images: [SOCIAL_IMAGES.research] }),
    route({ path: "/projects", changeFrequency: "monthly", priority: 0.82, images: [SOCIAL_IMAGES.research] }),
    route({ path: "/news", changeFrequency: "weekly", priority: 0.82, images: [SOCIAL_IMAGES.news] }),
    route({ path: "/publications", changeFrequency: "monthly", priority: 0.88, images: [SOCIAL_IMAGES.publications] }),
    route({ path: "/courses", changeFrequency: "yearly", priority: 0.58, images: [SOCIAL_IMAGES.default] }),
    route({ path: "/people", changeFrequency: "monthly", priority: 0.82, images: [SOCIAL_IMAGES.default] }),
    route({ path: "/opportunities", changeFrequency: "monthly", priority: 0.74, images: [SOCIAL_IMAGES.default] }),
    route({ path: "/contact", changeFrequency: "yearly", priority: 0.65, images: [SOCIAL_IMAGES.default] }),
    route({ path: "/bio", changeFrequency: "yearly", priority: 0.64, images: ["/images/social/profile-lag.png"] }),
    ...themes.map((theme) =>
      route({
        path: `/research/${theme.id}`,
        changeFrequency: "monthly",
        priority: 0.78,
        images: [SOCIAL_IMAGES.research],
      })
    ),
    ...projects.map((project) =>
      route({
        path: `/research/${project.id}`,
        changeFrequency: project.status === "active" ? "monthly" : "yearly",
        priority: project.status === "active" ? 0.76 : 0.58,
        images: [SOCIAL_IMAGES.research],
      })
    ),
    ...news.map((post) =>
      route({
        path: `/news/${post.id}`,
        lastModified: `${post.date}T00:00:00.000Z`,
        changeFrequency: "yearly",
        priority: 0.68,
        images: [(post as { socialImage?: string }).socialImage || post.image || SOCIAL_IMAGES.news],
      })
    ),
    ...peopleRefs.map((person) =>
      route({
        path: `/people/${person.id}`,
        changeFrequency: "monthly",
        priority: 0.62,
        images: [`/images/social/profile-${person.id}.png`],
      })
    ),
  ];
}
