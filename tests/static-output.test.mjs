import assert from 'node:assert/strict';
import {Buffer} from 'node:buffer';
import {readFileSync, readdirSync} from 'node:fs';
import {test} from 'node:test';
import articles from '../src/articles.ts';
import {formatDate} from '../src/format-date.ts';
import {parseGalleryFilenames} from '../src/gallery/gallery-filenames.ts';
import talks from './read-talks.mjs';

const gallery = parseGalleryFilenames(
  readdirSync(new URL('../src/gallery/', import.meta.url)).filter((path) =>
    /\.(?:jpg|jpeg|png)$/v.test(path),
  ),
);

const html = readFileSync(
  new URL('../dist/index.html', import.meta.url),
  'utf8',
);
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
const section = (id) =>
  html.match(
    new RegExp(
      String.raw`<section\s[^>]*id="${id}"[^>]*>([\s\S]*?)</section>`,
      'v',
    ),
  )?.[1] ?? '';

test('every talk is prerendered in date order and articles retain their resources', () => {
  const talkHtml = section('talks');
  const articleHtml = section('articles');
  assert.equal((talkHtml.match(/<li\b/gv) ?? []).length, talks.length);
  assert.equal((articleHtml.match(/<li\b/gv) ?? []).length, articles.length);
  let cursor = 0;
  for (const talk of talks) {
    const position = talkHtml.indexOf(escape(talk.conference), cursor);
    assert.ok(position >= cursor, talk.conference);
    cursor = position + escape(talk.conference).length;
    assert.ok(talkHtml.includes(escape(talk.name)), talk.name);
    assert.ok(talkHtml.includes(formatDate(talk.date)));
    const resources = [talk.video, talk.slides, talk.repo].filter(
      (url) => url && url !== 'none',
    );
    for (const url of resources) {
      assert.ok(talkHtml.includes(escape(url)), url);
    }
  }

  assert.equal(
    (talkHtml.match(/Not recorded/gv) ?? []).length,
    talks.filter((talk) => talk.video === 'none').length,
  );
  assert.equal(
    (talkHtml.match(/Coming soon/gv) ?? []).length,
    talks.filter((talk) => talk.video === undefined).length,
  );
  for (const article of articles) {
    assert.ok(articleHtml.includes(escape(article.title)), article.title);
    assert.ok(articleHtml.includes(escape(article.url)), article.url);
    assert.ok(articleHtml.includes(formatDate(article.date)));
  }
});

test('native anchors, metadata, gallery, and high-priority hero survive migration', () => {
  for (const id of ['talks', 'articles', 'socials']) {
    assert.ok(section(id));
  }

  assert.match(html, /<main\s[^>]*id="main"/v);
  assert.match(html, /href="#main"/v);
  assert.equal((html.match(/<h1\b/gv) ?? []).length, 1);
  assert.equal(
    (section('photos').match(/<img\b/gv) ?? []).length,
    gallery.length,
  );
  const alternatives = section('photos')
    .matchAll(/alt="(?<alt>[^"]*)"/gv)
    .map((match) => match.groups.alt)
    .toArray();
  assert.deepEqual(
    alternatives,
    gallery.map((photo) => escape(photo.alt)),
  );
  assert.match(html, /fetchpriority="high"/v);
  assert.match(html, /alt="Xen Project logo"/v);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/devrel\.codyfactory\.eu\/"/v,
  );
  assert.match(
    html,
    /property="og:image" content="https:\/\/devrel\.codyfactory\.eu\//v,
  );
  assert.doesNotMatch(html, /astro-island|id="root"/v);
});

test('content icons have production CSS, including flags from Markdown', () => {
  const assets = new URL('../dist/_astro/', import.meta.url);
  const css = readdirSync(assets)
    .filter((path) => path.endsWith('.css'))
    .map((path) => readFileSync(new URL(path, assets), 'utf8'))
    .join('\n');
  for (const flag of new Set(talks.map((talk) => talk.flag).filter(Boolean))) {
    assert.ok(css.includes(`.${flag}`), flag);
  }

  for (const icon of [
    'i-lucide-video',
    'i-lucide-video-off',
    'i-lucide-timer',
    'i-tabler-brand-x',
  ]) {
    assert.ok(css.includes(`.${icon}`), icon);
  }

  assert.match(css, /Roboto/v);
});

test('dates use English UTC dates across midnight boundaries', () => {
  assert.equal(formatDate('2026-01-01T00:30:00+02:00'), '31 December 2025');
  assert.equal(formatDate('2026-10-01T11:55Z'), '1 October 2026');
});

test('filters enhance static rows and external services have no legacy runtime', () => {
  const talkHtml = section('talks');
  assert.match(talkHtml, /<form[^>]*id="talk-filters"[^>]*hidden/v);
  const rows = talkHtml
    .matchAll(/<li\b[^>]*>/gv)
    .map((match) => match[0])
    .toArray();
  for (const [index, row] of rows.entries()) {
    const talk = talks[index];
    assert.ok(row.includes(`data-region="${talk.region}"`));
    assert.ok(
      row.includes(
        `data-video="${Boolean(talk.video && talk.video !== 'none')}"`,
      ),
    );
    assert.ok(row.includes(`data-slides="${Boolean(talk.slides)}"`));
    assert.ok(row.includes('data-search='));
    assert.doesNotMatch(row, /\bhidden\b/v);
  }

  assert.match(
    section('location'),
    /<iframe[^>]*loading="lazy"[^>]*height="315"/v,
  );
  assert.match(section('location'), /marker=45\.916%2C6\.133/v);
  assert.match(section('location'), /OpenStreetMap contributors/v);
  assert.equal(section('tweets'), '');
  assert.match(section('socials'), /https:\/\/twitter.com\/codyzus/v);
  assert.equal(
    (html.match(/gtag\('config', 'G-DMTB5F3X2D'\)/gv) ?? []).length,
    1,
  );
  assert.equal(
    (html.match(/googletagmanager.com\/gtag\/js/gv) ?? []).length,
    1,
  );
  assert.doesNotMatch(
    html,
    /data-tracked-link|platform\.twitter|maptiler|maplibre|insights-js/v,
  );
});

test('responsive photographs have real optimized files and correct loading priorities', () => {
  const pictures = html
    .matchAll(/<picture\b[^>]*>(?<content>[\s\S]*?)<\/picture>/gv)
    .toArray();
  assert.equal(pictures.length, gallery.length + 1);
  for (const [index, match] of pictures.entries()) {
    const picture = match.groups.content;
    assert.match(picture, /width="\d+" height="\d+"/v);
    assert.match(picture, /sizes="[^"]+"/v);
    assert.match(picture, index === 0 ? /loading="eager"/v : /loading="lazy"/v);
    if (index === 0) {
      assert.match(picture, /fetchpriority="high"/v);
    }

    for (const format of ['avif', 'webp', 'jpeg']) {
      const tag =
        format === 'jpeg'
          ? picture.match(/<img\b[^>]*>/v)?.[0]
          : picture.match(
              new RegExp(`<source[^>]*type="image/${format}"[^>]*>`, 'v'),
            )?.[0];
      assert.ok(tag, format);
      const srcset = tag.match(/srcset="(?<candidates>[^"]+)"/v)?.groups
        .candidates;
      assert.ok(srcset, format);
      const candidates = srcset
        .split(',')
        .map((candidate) => candidate.trim().split(' '));
      assert.ok(candidates.length >= 4);
      for (const [path, width] of candidates) {
        assert.match(width, /^\d+w$/v);
        const bytes = readFileSync(new URL(`../dist${path}`, import.meta.url));
        if (format === 'avif') {
          assert.ok(bytes.subarray(0, 32).includes(Buffer.from('avif')));
        } else if (format === 'webp') {
          assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
        } else {
          assert.equal(bytes.readUInt16BE(0), 0xff_d8);
        }
      }
    }
  }

  const css = readdirSync(new URL('../dist/_astro/', import.meta.url))
    .filter((path) => path.endsWith('.css'))
    .map((path) =>
      readFileSync(new URL(`../dist/_astro/${path}`, import.meta.url), 'utf8'),
    )
    .join('\n');
  assert.match(css, /@supports\s*\(display:\s*grid-lanes\)/v);
  assert.match(css, /grid-row:\s*auto/v);
  assert.match(css, /grid-(?:column:\s*span 2|area:\s*span 2\/span 2)/v);
});
