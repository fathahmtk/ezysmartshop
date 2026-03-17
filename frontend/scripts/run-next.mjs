import { realpathSync } from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const [, , nextCommand, ...args] = process.argv;

if (!nextCommand) {
  console.error("Missing Next.js command");
  process.exit(1);
}

const canonicalCwd = realpathSync(process.cwd());
process.chdir(canonicalCwd);

const nextBin = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [nextBin, nextCommand, ...args], {
  cwd: canonicalCwd,
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
