import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { activeIndex } from "../docs/playbook.js";

const html = await readFile(new URL("../docs/index.html", import.meta.url), "utf8");
const toc = html.slice(html.indexOf('<nav class="pb-toc"'), html.indexOf("</nav>", html.indexOf('<nav class="pb-toc"')));

test("activeIndex picks the last heading scrolled past the threshold", () => {
  assert.equal(activeIndex([-400, -20, 90, 600], 120), 2);
  assert.equal(activeIndex([-400, 121, 600], 120), 0);
  assert.equal(activeIndex([120, 300], 120), 0);
});

test("activeIndex defaults to the first heading before any are reached", () => {
  assert.equal(activeIndex([300, 900], 120), 0);
});

test("activeIndex selects the last heading at the bottom of the page", () => {
  assert.equal(activeIndex([-900, -300, 400], 120, true), 2);
});

test("activeIndex returns -1 when there are no headings", () => {
  assert.equal(activeIndex([], 120), -1);
});

test("element ids are unique", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(duplicates, []);
});

test("every contents link points to a heading on the page", () => {
  const hrefs = [...toc.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 0);
  for (const id of hrefs) {
    assert.match(html, new RegExp(`<h[23][^>]*\\sid="${id}"`), `missing heading for #${id}`);
  }
});

test("contents lists all nine numbered sections in order", () => {
  const numbers = [...toc.matchAll(/<i>(\d{2})<\/i>/g)].map((m) => Number(m[1]));
  assert.deepEqual(numbers, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("page stays compatible with its Content Security Policy", () => {
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)[^>]*>/, "inline <script> is blocked by script-src 'self'");
  assert.doesNotMatch(html, /\son[a-z]+="/i, "inline event handlers are blocked");
  assert.doesNotMatch(html, /\sstyle="/i, "inline styles are blocked by style-src");
});

test("links that open a new tab do not expose window.opener", () => {
  const blankLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
  assert.ok(blankLinks.length > 0);
  for (const tag of blankLinks) {
    assert.match(tag, /rel="noopener noreferrer"/, tag);
  }
});
