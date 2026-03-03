import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

type ImageTask = {
  name: string;
  intakeBase: string;
  outputPath: string;
  size: string;
};

const intakeRoot = path.join(process.cwd(), "assets", "image-intake");

const tasks: ImageTask[] = [
  // Themes
  {
    name: "theme/cps-security-semantics",
    intakeBase: "themes/cps-security-semantics",
    outputPath: "public/images/themes/cps-security-semantics.jpg",
    size: "1600x900",
  },
  {
    name: "theme/digital-twins-verification",
    intakeBase: "themes/digital-twins-verification",
    outputPath: "public/images/themes/digital-twins-verification.jpg",
    size: "1600x900",
  },
  {
    name: "theme/iot-sensor-privacy",
    intakeBase: "themes/iot-sensor-privacy",
    outputPath: "public/images/themes/iot-sensor-privacy.jpg",
    size: "1600x900",
  },
  {
    name: "theme/brain-centered-cps",
    intakeBase: "themes/brain-centered-cps",
    outputPath: "public/images/themes/brain-centered-cps.jpg",
    size: "1600x900",
  },
  {
    name: "theme/digital-twinning-for-ics",
    intakeBase: "themes/digital-twinning-for-ics",
    outputPath: "public/images/themes/digital-twinning-for-ics.jpg",
    size: "1600x900",
  },

  // Projects
  {
    name: "project/nsf-sphere",
    intakeBase: "projects/nsf-sphere",
    outputPath: "public/images/projects/sphere/hero.jpg",
    size: "1600x900",
  },
  {
    name: "project/nsf-fmitf",
    intakeBase: "projects/nsf-fmitf",
    outputPath: "public/images/projects/fmitf/hero.jpg",
    size: "1600x900",
  },
  {
    name: "project/darpa-smellcps",
    intakeBase: "projects/darpa-smellcps",
    outputPath: "public/images/projects/smellcps/hero.jpg",
    size: "1600x900",
  },
  {
    name: "project/nih-neuroscience-wild",
    intakeBase: "projects/nih-neuroscience-wild",
    outputPath: "public/images/projects/neuro-wild/hero.jpg",
    size: "1600x900",
  },
  {
    name: "project/nsf-ncs",
    intakeBase: "projects/nsf-ncs",
    outputPath: "public/images/projects/ncs/hero.jpg",
    size: "1600x900",
  },

  // News
  {
    name: "news/2025-sphere-shipping",
    intakeBase: "news/2025-sphere-shipping",
    outputPath: "public/images/news/sphere-racks.jpg",
    size: "1600x900",
  },
  {
    name: "news/2024-icps-demo",
    intakeBase: "news/2024-icps-demo",
    outputPath: "public/images/news/fmitf-demo.jpg",
    size: "1600x900",
  },
  {
    name: "news/2024-lab-award",
    intakeBase: "news/2024-lab-award",
    outputPath: "public/images/news/award.jpg",
    size: "1600x900",
  },
  {
    name: "news/2024-new-grant",
    intakeBase: "news/2024-new-grant",
    outputPath: "public/images/news/nsf-grant.jpg",
    size: "1600x900",
  },
  {
    name: "news/2024-conference-paper",
    intakeBase: "news/2024-conference-paper",
    outputPath: "public/images/news/ieee-paper.jpg",
    size: "1600x900",
  },
];

const sourceExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf"];

function findSourceFile(intakeBase: string): string | null {
  for (const ext of sourceExtensions) {
    const candidate = path.join(intakeRoot, `${intakeBase}${ext}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function buildMagickInput(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") {
    return `${filePath}[0]`;
  }
  return filePath;
}

function importImage(task: ImageTask): boolean {
  const source = findSourceFile(task.intakeBase);
  if (!source) {
    return false;
  }

  const outputAbs = path.join(process.cwd(), task.outputPath);
  ensureDir(outputAbs);

  const inputArg = buildMagickInput(source);
  execFileSync(
    "magick",
    [
      inputArg,
      "-auto-orient",
      "-resize",
      `${task.size}^`,
      "-gravity",
      "center",
      "-extent",
      task.size,
      "-quality",
      "90",
      outputAbs,
    ],
    { stdio: "inherit" }
  );

  return true;
}

function main() {
  let imported = 0;
  const missing: string[] = [];

  console.log("Importing image assets from", intakeRoot);

  for (const task of tasks) {
    const ok = importImage(task);
    if (ok) {
      imported += 1;
      console.log(`IMPORTED ${task.name} -> ${task.outputPath}`);
    } else {
      missing.push(task.intakeBase);
      console.log(`SKIP ${task.name} (missing source in assets/image-intake/${task.intakeBase}.*)`);
    }
  }

  console.log("\nImage import complete.");
  console.log(`Imported: ${imported}`);
  console.log(`Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log("\nMissing source files:");
    for (const m of missing) {
      console.log(`- assets/image-intake/${m}.[jpg|jpeg|png|webp|svg|pdf]`);
    }
  }
}

main();
