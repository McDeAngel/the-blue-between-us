import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("static export renders Shekinah's opening experience", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>The Blue Between Us — For Shekinah<\/title>/i);
  assert.match(html, /Shekinah T\. Rosete/);
  assert.match(html, /Open our little universe/);
  assert.match(html, /28 · 12 · 25/);
  assert.doesNotMatch(html, /codex-preview|Starter Project|loading skeleton/i);
});

test("ships the complete game and bespoke share image", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
  for (const chapter of ["Twin Frequency", "The Quiet", "Lily Garden", "Bogart", "Jelly Bean", "For Shekinah"]) assert.match(page, new RegExp(chapter));
  assert.match(page, /localStorage/);
  assert.match(page, /AudioContext/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle|vinext/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
