#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BASE_SUBDIR = process.env.EXPORT_BASE_SUBDIR || "3D-Portfolio";
const OUT_DIR = path.resolve(__dirname, "..", "out");
const TARGET_DIR = path.join(OUT_DIR, BASE_SUBDIR);

function ensureOutDirExists() {
  if (!fs.existsSync(OUT_DIR)) {
    throw new Error(
      `Expected export directory at ${OUT_DIR}, but it was not found.`
    );
  }
}

function removeTargetDir() {
  if (fs.existsSync(TARGET_DIR)) {
    fs.rmSync(TARGET_DIR, { recursive: true, force: true });
  }
}

function copyDir(src, dest, skipNames) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (skipNames.has(entry.name)) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, skipNames);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  ensureOutDirExists();
  removeTargetDir();

  copyDir(OUT_DIR, TARGET_DIR, new Set([BASE_SUBDIR]));

  console.log(
    `Duplicated static export into ${TARGET_DIR} for multi-domain support.`
  );
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error("[postExport] Failed to duplicate export output:", error);
    process.exit(1);
  }
}
