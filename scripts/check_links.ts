import fs from "fs";
import path from "path";

function assertExists(p: string, msg: string) {
  if (!fs.existsSync(p)) { 
    console.error("MISSING:", msg, "->", p); 
    process.exitCode = 1; 
  }
}

const peopleDir = path.join(process.cwd(), "src", "data", "profiles");
["iris.json","lawrence.json","burke.json","miles_bovero.json"].forEach(f => {
  assertExists(path.join(peopleDir, f), "people profile "+f);
});

const projData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "research-projects.json"), "utf8"));
projData.featuredProjects.forEach((p:any) => {
  const route = path.join(process.cwd(),"src","app","research",p.id,"page.tsx");
  assertExists(route, "project page for "+p.id);
});

console.log("Link check completed");

