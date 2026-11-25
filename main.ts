// post-x-promote-make-your-own-bounty-01
//
// The entry itself is an X post: a quote of make.fun's
// make-your-own-bounty post, with a photo of its own attached.
// This program does the one job the bounty asks of it: it carries
// the post's address, recorded in POST.json at the repository root,
// into the output folder the grader reads.
//
// Node 22, standard library only. No network, no installs, no
// secrets. It never deletes the output folder; it only makes sure
// the folder exists and puts a copy of POST.json inside it.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const source = join(repoRoot, "POST.json");
const target = join(outDir, "POST.json");

if (!existsSync(source)) {
  throw new Error("POST.json not found in the repository root");
}

const parsed = JSON.parse(readFileSync(source, "utf8"));

if (typeof parsed !== "object" || parsed === null || typeof parsed.url !== "string") {
  throw new Error("POST.json must be an object with a url string");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Read the copy back and check it is still a valid post record:
// the grader only accepts a JSON object whose url is a string.
const copied = JSON.parse(readFileSync(target, "utf8"));

if (typeof copied !== "object" || copied === null || typeof copied.url !== "string") {
  throw new Error("copied POST.json is not a JSON object with a url string");
}

console.log(`copied POST.json -> ${target}`);
