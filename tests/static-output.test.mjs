import assert from 'node:assert/strict';
import {Buffer} from 'node:buffer';
import {readFileSync, readdirSync} from 'node:fs';
import {test} from 'node:test';
import sharp from 'sharp';
import {formatDate} from '../src/format-date.ts';
import {parseGalleryFilenames} from '../src/gallery/gallery-filenames.ts';
import {sortTalkHighlights} from '../src/talks/sort-talk-highlights.ts';
import articles from './read-articles.mjs';
import talks, {entries as talkEntries} from './read-talks.mjs';

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
      String.raw`<section\s[^>]*id="${id}"[^>]*>(?<content>[\s\S]*?)</section>`,
      'v',
    ),
  )?.groups.content ?? '';
const talkArchive = () =>
  section('talks').match(
    /<ul\b[^>]+class="talks"[^>]*>(?<content>[\s\S]*?)<\/ul>/v,
  )?.groups.content ?? '';

test('every talk is prerendered in date order and articles retain their resources', () => {
  const talkHtml = talkArchive();
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
    const resources = [talk.video, talk.slides, talk.repo].filter(Boolean);
    for (const url of resources) {
      assert.ok(talkHtml.includes(escape(url)), url);
    }
  }

  assert.equal(
    (talkHtml.match(/Not recorded/gv) ?? []).length,
    talks.filter((talk) => talk.recordingStatus === 'not-recorded').length,
  );
  assert.equal(
    (talkHtml.match(/Recording unavailable/gv) ?? []).length,
    talks.filter((talk) => talk.recordingStatus === 'unavailable').length,
  );
  assert.doesNotMatch(talkHtml, /Coming soon|Upcoming/v);
  assert.equal(
    (talkHtml.match(/Recording not yet published/gv) ?? []).length,
    talks.filter((talk) => talk.recordingStatus === 'unpublished').length,
  );
  let articleCursor = 0;
  for (const article of articles) {
    const position = articleHtml.indexOf(escape(article.title), articleCursor);
    assert.ok(position >= articleCursor, article.title);
    articleCursor = position + escape(article.title).length;
    assert.ok(articleHtml.includes(escape(article.url)), article.url);
    assert.ok(articleHtml.includes(`datetime="${article.date}"`));
    assert.ok(articleHtml.includes(formatDate(article.date)));
  }
});

test('selected talks precede the intact archive with verified copy and available resources', () => {
  const talkHtml = section('talks');
  const highlights = talkHtml.match(
    /<ul\b[^>]+class="talk-highlights[^"]*"[^>]*>(?<content>[\s\S]*?)<\/ul>/v,
  )?.groups.content;
  assert.ok(highlights);
  const cards = highlights
    .matchAll(/<li\b[^>]*>(?<content>[\s\S]*?)<\/li>/gv)
    .toArray();
  const selected = sortTalkHighlights(talkEntries);
  assert.equal(cards.length, 3);
  assert.deepEqual(
    selected.map(({data}) => data.highlightOrder),
    [10, 20, 30],
  );
  for (const [index, {data}] of selected.entries()) {
    const card = cards[index].groups.content;
    assert.ok(card.includes(escape(data.name)));
    assert.ok(card.includes(escape(data.conference)));
    assert.ok(card.includes(formatDate(data.date)));
    assert.ok(card.includes(escape(data.description)));
    assert.ok(card.includes(`alt="${escape(data.thumbnailAlt)}"`));
    assert.match(card, /<picture\b/v);
    assert.match(card, /loading="lazy"/v);
    assert.match(card, /width="1200" height="675"/v);
    assert.ok(!talkArchive().includes(escape(data.description)));
    const resources = [data.video, data.slides, data.repo].filter(Boolean);
    assert.equal((card.match(/<a\b/gv) ?? []).length, resources.length);
    for (const url of resources) {
      assert.ok(card.includes(escape(url)));
    }

    assert.doesNotMatch(card, /Coming soon|data-search=/v);
  }

  assert.ok(
    talkHtml.indexOf(highlights) < talkHtml.indexOf('id="talk-filters"'),
  );
  assert.match(talkHtml, /Selected talks to start with/v);
  assert.match(talkHtml, /All speaking engagements/v);
  assert.equal((talkArchive().match(/<li\b/gv) ?? []).length, talks.length);
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

test('search and sharing metadata agree and reference a real production sharing image', async () => {
  const metadata = (attribute, key) => {
    const matches = html
      .matchAll(
        new RegExp(`<meta ${attribute}="${key}" content="([^"]*)"`, 'gv'),
      )
      .toArray();
    assert.equal(matches.length, 1, key);
    return matches[0][1];
  };

  const title = html.match(/<title>(?<title>[^<]*)<\/title>/v)?.groups.title;
  assert.match(title, /Cody Zuschlag.*Xen Project Community Manager/v);
  assert.equal(metadata('property', 'og:title'), title);
  assert.equal(metadata('name', 'twitter:title'), title);
  const description = metadata('name', 'description');
  for (const phrase of [
    'Xen Project Community Manager',
    'international speaker',
    'university instructor',
    'open-source virtualization',
  ]) {
    assert.ok(description.includes(phrase), phrase);
  }

  assert.equal(metadata('property', 'og:description'), description);
  assert.equal(metadata('name', 'twitter:description'), description);
  assert.equal(
    metadata('property', 'og:url'),
    'https://devrel.codyfactory.eu/',
  );
  const image = new URL(metadata('property', 'og:image'));
  assert.equal(image.origin, 'https://devrel.codyfactory.eu');
  assert.equal(image.pathname, '/social-sharing.jpg');
  assert.equal(metadata('name', 'twitter:image'), image.href);
  assert.equal(metadata('name', 'twitter:card'), 'summary_large_image');
  const alternative = metadata('property', 'og:image:alt');
  assert.match(alternative, /Cody Zuschlag.*Xen Project Community Manager/v);
  assert.equal(metadata('name', 'twitter:image:alt'), alternative);
  const bytes = readFileSync(
    new URL(`../dist${image.pathname}`, import.meta.url),
  );
  const {width, height, format} = await sharp(bytes).metadata();
  assert.equal(format, 'jpeg');
  assert.equal(metadata('property', 'og:image:type'), `image/${format}`);
  assert.equal(width, 1200);
  assert.equal(height, 630);
  assert.equal(metadata('property', 'og:image:width'), String(width));
  assert.equal(metadata('property', 'og:image:height'), String(height));
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
    'i-lucide-house',
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
  const rows = talkArchive()
    .matchAll(/<li\b[^>]*>/gv)
    .map((match) => match[0])
    .toArray();
  for (const [index, row] of rows.entries()) {
    const talk = talks[index];
    assert.ok(row.includes(`data-region="${talk.region}"`));
    assert.ok(row.includes(`data-video="${Boolean(talk.video)}"`));
    assert.ok(row.includes(`data-slides="${Boolean(talk.slides)}"`));
    assert.ok(row.includes('data-search='));
    assert.doesNotMatch(row, /\bhidden\b/v);
  }

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
  assert.equal(
    pictures.length,
    gallery.length + 1 + sortTalkHighlights(talkEntries).length,
  );
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
  // Astro may inline small page-specific styles when shared CSS is split.
  const pageCss = html
    .matchAll(/<style[^>]*>(?<css>[\s\S]*?)<\/style>/gv)
    .map((match) => match.groups.css)
    .toArray()
    .join('\n');
  const galleryCss = `${css}\n${pageCss}`;
  assert.match(galleryCss, /@supports\s*\(display:\s*grid-lanes\)/v);
  assert.match(galleryCss, /grid-row:\s*auto/v);
  assert.match(galleryCss, /grid-(?:column:\s*span 2|area:\s*span 2\/span 2)/v);
});

test('speaking map preserves a readable city summary without JavaScript', () => {
  const mapHtml = section('location');
  assert.match(mapHtml, /Speaking around the world/v);
  assert.match(mapHtml, /34 in-person speaking engagements across 17 cities/v);
  assert.match(mapHtml, /id="speaking-map"[^>]*hidden/v);
  assert.match(mapHtml, /<details/v);
  assert.equal((mapHtml.match(/data-map-city/gv) ?? []).length, 17);
  assert.match(mapHtml, /Kilkenny, Ireland · 14 engagements/v);
  assert.match(mapHtml, /Tokyo, Japan · 1 engagement/v);
  assert.match(mapHtml, /View Annecy on OpenStreetMap/v);
  assert.match(mapHtml, /OpenStreetMap contributors/v);
  assert.doesNotMatch(mapHtml, /<iframe/v);
});
