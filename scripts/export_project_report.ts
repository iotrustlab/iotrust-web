import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src", "data");
const themesPath = path.join(root, "themes.json");
const projectsPath = path.join(root, "projects.json");
const outPath = path.join(process.cwd(), "project_report.md");
const projects = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));
const themes = JSON.parse(fs.readFileSync(themesPath, "utf-8"));

function webImageExists(webPath?: string) {
  if (!webPath) return false;
  const rel = webPath.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", rel));
}

function themeTitles(ids: string[]) {
  const titleById = new Map(themes.map((t: { id: string; title: string }) => [t.id, t.title]));
  return ids.map((id: string) => titleById.get(id) ?? id);
}

function heroImageInfo(heroImage?: string) {
  if (!heroImage) return "—";
  return `${heroImage} (${webImageExists(heroImage) ? "found" : "missing"})`;
}

function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "proposed":
      return "Proposed";
    default:
      return status;
  }
}

let md = "# Project Report\n\n";
for (const p of projects) {
  md += `## ${p.title} (/research/${p.id})\n`;
  md += `**Agency**: ${p.agency}\n\n`;
  md += `**Years**: ${p.years}\n\n`;
  md += `**Status**: ${statusLabel(p.status)}\n\n`;
  md += `**Themes**: ${themeTitles(p.themes).join(", ") || "—"}\n\n`;
  md += `**Abstract**: ${p.abstract || "—"}\n\n`;
  md += `**Team**: ${(p.team || []).join(", ") || "—"}\n\n`;
  md += `**Publications (IDs)**: ${(p.publications || []).join(", ") || "—"}\n\n`;
  md += `**Hero image**: ${heroImageInfo(p.heroImage)}\n\n`;
}
fs.writeFileSync(outPath, md);
console.log("Wrote", outPath);

