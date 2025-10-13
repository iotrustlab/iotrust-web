import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src", "data");
const projectsPath = path.join(root, "research-projects.json");
const outPath = path.join(process.cwd(), "project_report.md");
const projects = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));

function findImages(id: string) {
  const dir = path.join(process.cwd(), "public", "images", "projects", id);
  try { 
    return fs.readdirSync(dir).filter(f => !f.startsWith(".")); 
  } catch { 
    return []; 
  }
}

let md = "# Project Report\n\n";
for (const p of projects.featuredProjects) {
  const imgs = findImages(p.id);
  md += `## ${p.title} (/${p.id})\n`;
  md += `**Funding**: ${p.funding?.agency ?? ""} ${p.funding?.duration ?? ""}\n\n`;
  md += `${p.description ?? ""}\n\n`;
  md += `**Team**: ${(p.team||[]).join(", ")}\n\n`;
  md += `**Publications**: ${p.publications || 0}\n\n`;
  md += `**Images found**: ${imgs.join(", ") || "—"}\n\n`;
}
fs.writeFileSync(outPath, md);
console.log("Wrote", outPath);

