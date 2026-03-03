import fs from "fs";
import path from "path";

type Theme = {
  id: string;
  projectIds?: string[];
  featuredPubIds?: string[];
  image?: string;
};

type Project = {
  id: string;
  themes?: string[];
  heroImage?: string;
};

type NewsItem = {
  id: string;
  image?: string;
};

type Publication = {
  id: string;
  themeIds?: string[];
};

type PeopleIndex = {
  principalInvestigator: Array<{ id: string }>;
  postdocs: Array<{ id: string }>;
  phdStudents: Array<{ id: string }>;
  undergrads: Array<{ id: string }>;
  alumni: Array<{ id: string }>;
};

type Profile = {
  image?: string;
};

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const publicDir = path.join(root, "public");

let failures = 0;
let warnings = 0;

function fail(message: string) {
  console.error(`ERROR: ${message}`);
  failures += 1;
}

function warn(message: string) {
  console.warn(`WARN: ${message}`);
  warnings += 1;
}

function readJson<T>(filePath: string, label: string): T | null {
  if (!fs.existsSync(filePath)) {
    fail(`${label} missing at ${filePath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch (error) {
    fail(`could not parse ${label}: ${(error as Error).message}`);
    return null;
  }
}

function fileExistsInPublic(webPath: string): boolean {
  const relPath = webPath.replace(/^\//, "");
  return fs.existsSync(path.join(publicDir, relPath));
}

function checkImagePath(imagePath: string | undefined, label: string) {
  if (!imagePath) return;

  if (!imagePath.startsWith("/")) {
    warn(`${label} uses a non-root image path (${imagePath})`);
    return;
  }

  if (!fileExistsInPublic(imagePath)) {
    fail(`${label} image not found in public/: ${imagePath}`);
  }
}

function checkRouteFile(routePath: string, label: string) {
  if (!fs.existsSync(routePath)) {
    fail(`${label} route file missing: ${routePath}`);
  }
}

const themes = readJson<Theme[]>(path.join(dataDir, "themes.json"), "themes.json");
const projects = readJson<Project[]>(path.join(dataDir, "projects.json"), "projects.json");
const news = readJson<NewsItem[]>(path.join(dataDir, "news.json"), "news.json");
const publicationsData = readJson<{ recentPublications: Publication[] }>(
  path.join(dataDir, "publications.json"),
  "publications.json"
);
const peopleIndex = readJson<PeopleIndex>(path.join(dataDir, "people-index.json"), "people-index.json");

if (!themes || !projects || !news || !publicationsData || !peopleIndex) {
  process.exit(1);
}

checkRouteFile(path.join(root, "src", "app", "research", "[slug]", "page.tsx"), "research detail");
checkRouteFile(path.join(root, "src", "app", "news", "[id]", "page.tsx"), "news detail");

const themeIdSet = new Set(themes.map((t) => t.id));
const projectIdSet = new Set(projects.map((p) => p.id));
const publicationIdSet = new Set(publicationsData.recentPublications.map((p) => p.id));

// Ensure theme and project IDs do not collide in unified /research/[slug] routes.
for (const theme of themes) {
  if (projectIdSet.has(theme.id)) {
    fail(`theme id "${theme.id}" collides with a project id`);
  }
}

for (const theme of themes) {
  for (const projectId of theme.projectIds ?? []) {
    if (!projectIdSet.has(projectId)) {
      fail(`theme "${theme.id}" references missing project "${projectId}"`);
    }
  }
  for (const pubId of theme.featuredPubIds ?? []) {
    if (!publicationIdSet.has(pubId)) {
      fail(`theme "${theme.id}" references missing publication "${pubId}"`);
    }
  }
  checkImagePath(theme.image, `theme "${theme.id}"`);
}

for (const project of projects) {
  for (const themeId of project.themes ?? []) {
    if (!themeIdSet.has(themeId)) {
      fail(`project "${project.id}" references missing theme "${themeId}"`);
    }
  }
  checkImagePath(project.heroImage, `project "${project.id}"`);
}

for (const publication of publicationsData.recentPublications) {
  for (const themeId of publication.themeIds ?? []) {
    if (!themeIdSet.has(themeId)) {
      fail(`publication "${publication.id}" references missing theme "${themeId}"`);
    }
  }
}

for (const item of news) {
  checkImagePath(item.image, `news "${item.id}"`);
}

const profileIds = [
  ...peopleIndex.principalInvestigator,
  ...peopleIndex.postdocs,
  ...peopleIndex.phdStudents,
  ...peopleIndex.undergrads,
  ...peopleIndex.alumni,
].map((person) => person.id);

for (const id of profileIds) {
  const profilePath = path.join(dataDir, "profiles", `${id}.json`);
  const profile = readJson<Profile>(profilePath, `profile "${id}"`);
  if (!profile) continue;
  checkImagePath(profile.image, `profile "${id}"`);
}

console.log("\nLink and asset checks completed.");
console.log(`Failures: ${failures}`);
console.log(`Warnings: ${warnings}`);

if (failures > 0) {
  process.exitCode = 1;
}

