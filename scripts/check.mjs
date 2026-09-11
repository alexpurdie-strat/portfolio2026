#!/usr/bin/env node
/*
 * Hygiene gate.
 *
 * The brief's content rules are only real if something enforces them, so this
 * fails the build on the things that must never ship: placeholder text,
 * unresolved gaps, images without alt text, dead links, and UK spellings.
 * Run with --draft while writing to allow TODO(alex) markers through.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const draft = process.argv.includes("--draft");
const problems = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "out", "qa"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".tsx", ".ts", ".mdx", ".md", ".css"].includes(extname(p))) out.push(p);
  }
  return out;
}

/* UK spellings that give away a London CV to a US reader. */
const UK = [
  "organisation", "organise", "recognise", "prioritise", "minimise", "maximise",
  "utilise", "analyse", "behaviour", "colour", "favour", "labour",
  "programme", "defence", "licence", "catalogue",
  "fulfil", "enrol", "traveller", "modelling", "learnt", "whilst", "amongst",
];

const files = walk("src");
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const isContent = file.includes("/content/") || file.includes("/app/");

  text.split("\n").forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    if (/lorem ipsum/i.test(line)) problems.push(`${at}  lorem ipsum`);
    /* Both forms of a gap: the literal marker, and the <Todo> component that
       renders one. Missing the second would let every visible gap on the site
       through the gate that exists to stop exactly that. */
    if (!draft && /TODO\(alex\)/.test(line)) problems.push(`${at}  unresolved TODO(alex)`);
    if (!draft && /<Todo>/.test(line) && !file.endsWith("todo.tsx")) {
      problems.push(`${at}  unresolved <Todo> marker`);
    }
    if (/href="#"/.test(line)) problems.push(`${at}  dead link href="#"`);
    if (isContent && /<img(?![^>]*\balt=)/.test(line)) problems.push(`${at}  <img> without alt`);
    for (const w of UK) {
      if (new RegExp(`\\b${w}`, "i").test(line)) problems.push(`${at}  UK spelling "${w}"`);
    }
  });
}

for (const file of files.filter((f) => /app\/.*page\.tsx$/.test(f))) {
  if (!/metadata|generateMetadata/.test(readFileSync(file, "utf8"))) {
    problems.push(`${file}  no metadata export`);
  }
}

const todos = files.reduce((n, f) => {
  if (f.endsWith("todo.tsx")) return n;
  const t = readFileSync(f, "utf8");
  return n + (t.match(/TODO\(alex\)/g)?.length ?? 0) + (t.match(/<Todo>/g)?.length ?? 0);
}, 0);

if (problems.length) {
  console.error(`\n✗ ${problems.length} problem${problems.length > 1 ? "s" : ""}:\n`);
  for (const p of problems) console.error("  " + p);
  console.error("");
  process.exit(1);
}
console.log(`✓ hygiene clean across ${files.length} files` +
  (draft ? `  (${todos} TODO(alex) outstanding, allowed in draft)` : ""));
