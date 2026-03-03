/**
 * validate-themes.ts
 *
 * Validates theme data integrity:
 * - All projectIds in themes exist in projects.json
 * - All featuredPubIds in themes exist in publications.json
 * - All theme IDs referenced in projects.themes exist in themes.json
 *
 * Usage: npx tsx scripts/validate-themes.ts
 */

import fs from "fs";
import path from "path";

interface Theme {
  id: string;
  title: string;
  summary: string;
  projectIds: string[];
  featuredPubIds: string[];
  image?: string;
  featured?: Array<{ type: 'project' | 'pub'; id: string }>;
}

interface Project {
  id: string;
  title: string;
  themes: string[];
}

interface Publication {
  id: string;
  title: string;
  themeIds?: string[];
}

interface PublicationsData {
  recentPublications: Publication[];
}

const dataDir = path.join(process.cwd(), "src", "data");

// Load data files
const themes: Theme[] = JSON.parse(
  fs.readFileSync(path.join(dataDir, "themes.json"), "utf8")
);
const projects: Project[] = JSON.parse(
  fs.readFileSync(path.join(dataDir, "projects.json"), "utf8")
);
const pubsData: PublicationsData = JSON.parse(
  fs.readFileSync(path.join(dataDir, "publications.json"), "utf8")
);
const publications = pubsData.recentPublications;

// Create lookup sets
const projectIds = new Set(projects.map(p => p.id));
const publicationIds = new Set(publications.map(p => p.id));
const themeIds = new Set(themes.map(t => t.id));

let hasErrors = false;
let warningCount = 0;

console.log("=== Theme Validation ===\n");

// 1. Check that all projectIds in themes exist
console.log("Checking theme projectIds...");
for (const theme of themes) {
  for (const projId of theme.projectIds) {
    if (!projectIds.has(projId)) {
      console.error(`  ERROR: Theme "${theme.id}" references non-existent project: ${projId}`);
      hasErrors = true;
    }
  }
}

// 2. Check that all featuredPubIds in themes exist
console.log("Checking theme featuredPubIds...");
for (const theme of themes) {
  for (const pubId of theme.featuredPubIds || []) {
    if (!publicationIds.has(pubId)) {
      console.error(`  ERROR: Theme "${theme.id}" references non-existent publication: ${pubId}`);
      hasErrors = true;
    }
  }
}

// 3. Check optional featured array
console.log("Checking theme featured arrays...");
for (const theme of themes) {
  if (theme.featured) {
    for (const item of theme.featured) {
      if (item.type === 'project' && !projectIds.has(item.id)) {
        console.error(`  ERROR: Theme "${theme.id}" featured references non-existent project: ${item.id}`);
        hasErrors = true;
      }
      if (item.type === 'pub' && !publicationIds.has(item.id)) {
        console.error(`  ERROR: Theme "${theme.id}" featured references non-existent publication: ${item.id}`);
        hasErrors = true;
      }
    }
  }
}

// 4. Check that all theme IDs in projects.themes exist
console.log("Checking project theme references...");
for (const project of projects) {
  for (const tid of project.themes || []) {
    if (!themeIds.has(tid)) {
      console.error(`  ERROR: Project "${project.id}" references non-existent theme: ${tid}`);
      hasErrors = true;
    }
  }
}

// 5. Check that all theme IDs in publications.themeIds exist
console.log("Checking publication themeIds...");
for (const pub of publications) {
  for (const tid of pub.themeIds || []) {
    if (!themeIds.has(tid)) {
      console.warn(`  WARNING: Publication "${pub.id}" references non-existent theme: ${tid}`);
      warningCount++;
    }
  }
}

// 6. Check for theme images
console.log("Checking theme images...");
const missingImages: string[] = [];
for (const theme of themes) {
  if (theme.image) {
    const imagePath = path.join(process.cwd(), "public", theme.image);
    if (!fs.existsSync(imagePath)) {
      missingImages.push(`Theme "${theme.id}" image not found: ${theme.image}`);
      warningCount++;
    }
  }
}
// Print image warnings after all checks
for (const msg of missingImages) {
  console.warn(`  WARNING: ${msg}`);
}

// Summary
console.log("\n=== Summary ===");
console.log(`Themes: ${themes.length}`);
console.log(`Projects: ${projects.length}`);
console.log(`Publications: ${publications.length}`);

if (hasErrors) {
  console.error(`\nValidation FAILED with errors.`);
  process.exit(1);
} else if (warningCount > 0) {
  console.warn(`\nValidation passed with ${warningCount} warning(s).`);
} else {
  console.log(`\nValidation passed with no issues.`);
}
