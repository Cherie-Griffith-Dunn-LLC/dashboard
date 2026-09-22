// Package only the new authenticated API. Legacy simulation endpoints stay out.
const fs = require("node:fs");
const path = require("node:path");
const base = path.resolve(__dirname, "..");
const output = path.join(base, "dist/customer-api");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "shared"), { recursive: true });
for (const file of [
  "package.json",
  "package-lock.json",
  "host.json",
  "CustomerPortal",
]) {
  fs.cpSync(path.join(base, "api", file), path.join(output, file), {
    recursive: true,
  });
}
fs.cpSync(
  path.join(base, "api/shared/portal"),
  path.join(output, "shared/portal"),
  { recursive: true },
);
fs.copyFileSync(
  path.join(base, "api/shared/http.js"),
  path.join(output, "shared/http.js"),
);
console.log(
  "Staged isolated customer API at dist/customer-api. No environment files or credentials included.",
);
