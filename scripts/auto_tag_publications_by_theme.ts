#!/usr/bin/env ts-node
/**
 * Auto-tag publications with theme IDs based on keyword matching
 *
 * This script analyzes publication titles, abstracts, and keywords to automatically
 * assign themeIds to publications in publications.json. It uses keyword rules for
 * each theme and merges results with any existing manual tags.
 *
 * Usage:
 *   npm run auto-tag-pubs
 *   or: ts-node scripts/auto_tag_publications_by_theme.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Theme {
  id: string;
  title: string;
  summary: string;
  projectIds: string[];
  featuredPubIds: string[];
  image: string;
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number | null;
  type: string;
  url: string;
  abstract: string;
  keywords: string[];
  tags: string[];
  themeIds?: string[];
  awards?: string[];
}

interface PublicationsData {
  recentPublications: Publication[];
}

// Theme keyword rules for matching
const THEME_KEYWORDS: Record<string, string[]> = {
  'digital-twinning-for-ics': [
    'scada', 'plc', 'industrial control', 'ics', 'water', 'swat', 'modbus',
    'allen-bradley', 'rockwell', 'programmable logic', 'ladder logic',
    'control system', 'attestation', 'firmware', 'embedded', 'controller'
  ],
  'cps-security-semantics': [
    'threat', 'attack', 'intrusion', 'security', 'semantics', 'tracking',
    'fuzzing', 'program analysis', 'reverse engineering', 'malware',
    'rootkit', 'detection', 'backdoor', 'vulnerability', 'exploit'
  ],
  'digital-twins-verification': [
    'verification', 'formal', 'hybrid', 'logic', 'proof', 'twin',
    'fidelity', 'model checking', 'theorem proving', 'symbolic',
    'correctness', 'specification'
  ],
  'iot-sensor-privacy': [
    'iot', 'privacy', 'sensor', 'wearable', 'rf', 'wireless', 'edge',
    'privacy-preserving', 'localization', 'clandestine', 'sensing',
    'privacy oracle', 'information flow', 'access control', 'permissions'
  ],
  'brain-centered-cps': [
    'brain', 'neuro', 'eeg', 'memory', 'cognition', 'multimodal',
    'intracranial', 'episodic', 'neural', 'perception', 'stress',
    'context', 'human-in-the-loop', 'bio-signal', 'wearable'
  ]
};

function loadThemes(): Theme[] {
  const themesPath = join(process.cwd(), 'src/data/themes.json');
  return JSON.parse(readFileSync(themesPath, 'utf-8'));
}

function loadPublications(): PublicationsData {
  const pubsPath = join(process.cwd(), 'src/data/publications.json');
  return JSON.parse(readFileSync(pubsPath, 'utf-8'));
}

function savePublications(data: PublicationsData): void {
  const pubsPath = join(process.cwd(), 'src/data/publications.json');
  writeFileSync(pubsPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function matchesTheme(pub: Publication, themeId: string, keywords: string[]): boolean {
  const searchText = normalizeText(
    `${pub.title} ${pub.abstract} ${pub.keywords.join(' ')} ${pub.tags.join(' ')}`
  );

  // Count keyword matches
  let matches = 0;
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (searchText.includes(normalizedKeyword)) {
      matches++;
    }
  }

  // Require at least 2 keyword matches to assign a theme
  // (prevents false positives from single common words)
  return matches >= 2;
}

function autoTagPublications(): void {
  console.log('🏷️  Auto-tagging publications by theme...\n');

  const themes = loadThemes();
  const data = loadPublications();
  const publications = data.recentPublications;

  // Statistics
  const stats: Record<string, number> = {};
  const multiTagged: string[] = [];
  const untagged: string[] = [];
  let totalTagged = 0;
  let totalManual = 0;

  themes.forEach(theme => { stats[theme.id] = 0; });

  // Process each publication
  publications.forEach(pub => {
    // Preserve any manually-set themeIds
    const manualThemeIds = pub.themeIds || [];
    const autoThemeIds: string[] = [];

    if (manualThemeIds.length > 0) {
      totalManual++;
    }

    // Auto-detect themes based on keywords
    themes.forEach(theme => {
      const keywords = THEME_KEYWORDS[theme.id] || [];
      if (matchesTheme(pub, theme.id, keywords)) {
        autoThemeIds.push(theme.id);
      }
    });

    // Merge manual and auto tags (manual takes precedence)
    const mergedThemeIds = Array.from(new Set([...manualThemeIds, ...autoThemeIds]));

    // Update publication
    if (mergedThemeIds.length > 0) {
      pub.themeIds = mergedThemeIds.sort();
      totalTagged++;

      // Update stats
      mergedThemeIds.forEach(themeId => {
        if (stats[themeId] !== undefined) {
          stats[themeId]++;
        }
      });

      // Track multi-tagged pubs
      if (mergedThemeIds.length >= 3) {
        multiTagged.push(pub.id);
      }
    } else {
      // No theme matched
      untagged.push(pub.id);
      delete pub.themeIds; // Remove empty arrays
    }
  });

  // Save updated publications
  savePublications(data);

  // Print report
  console.log('✅ Auto-tagging complete!\n');
  console.log('📊 Theme Statistics:');
  console.log('─'.repeat(60));
  themes.forEach(theme => {
    const count = stats[theme.id] || 0;
    const featured = theme.featuredPubIds.length;
    console.log(`  ${theme.title}`);
    console.log(`    ID: ${theme.id}`);
    console.log(`    Tagged: ${count} publications`);
    console.log(`    Featured: ${featured} publications`);
    console.log(`    Related: ${Math.max(0, count - featured)} publications\n`);
  });

  console.log('─'.repeat(60));
  console.log(`\n📈 Summary:`);
  console.log(`  Total publications: ${publications.length}`);
  console.log(`  Tagged publications: ${totalTagged} (${((totalTagged/publications.length)*100).toFixed(1)}%)`);
  console.log(`  Manually tagged: ${totalManual}`);
  console.log(`  Untagged publications: ${untagged.length}`);
  console.log(`  Multi-theme pubs (3+ themes): ${multiTagged.length}\n`);

  if (multiTagged.length > 0) {
    console.log('⚠️  Publications tagged to 3+ themes (potential false positives):');
    multiTagged.forEach(id => {
      const pub = publications.find(p => p.id === id);
      if (pub) {
        console.log(`  - ${id}: ${pub.themeIds?.join(', ')}`);
        console.log(`    "${pub.title}"\n`);
      }
    });
  }

  if (untagged.length > 0 && untagged.length <= 20) {
    console.log('📝 Untagged publications (consider manual tagging):');
    untagged.forEach(id => {
      const pub = publications.find(p => p.id === id);
      if (pub) {
        console.log(`  - ${id}: "${pub.title}"`);
      }
    });
    console.log();
  } else if (untagged.length > 20) {
    console.log(`📝 ${untagged.length} untagged publications (too many to list)\n`);
  }

  console.log('💾 Updated: src/data/publications.json\n');
}

// Run the script
autoTagPublications();
