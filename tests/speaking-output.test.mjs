import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import sharp from 'sharp';
import {speakerEmail, speakingInquiryUrl} from '../src/speaking/contact.ts';
import talks from './read-talks.mjs';

const html = readFileSync(
  new URL('../dist/speaking/index.html', import.meta.url),
  'utf8',
);
const home = readFileSync(
  new URL('../dist/index.html', import.meta.url),
  'utf8',
);

test('speaker materials are prerendered with distinct metadata and native navigation', () => {
  assert.match(home, /href="\/speaking"/v);
  assert.match(
    html,
    /<title>Speaking &amp; speaker materials \| Cody Zuschlag<\/title>/v,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/devrel\.codyfactory\.eu\/speaking\/"/v,
  );
  assert.match(
    html,
    /property="og:url" content="https:\/\/devrel\.codyfactory\.eu\/speaking\/"/v,
  );
  assert.match(
    html,
    /name="description" content="Invite Cody Zuschlag to speak/v,
  );
  assert.equal((html.match(/<h1\b/gv) ?? []).length, 1);
  assert.match(html, /href="#main"/v);
  assert.match(html, /<main[^>]*id="main"[^>]*tabindex="-1"/v);
  assert.match(html, /href="\/#talks"/v);
  for (const text of [
    'Short bio',
    'Long bio',
    'Topics we could explore',
    'For organizers',
  ]) {
    assert.ok(html.includes(text), text);
  }

  assert.ok(html.includes(`href="${speakingInquiryUrl}"`));
  assert.ok(html.includes(speakerEmail));
  const recording = talks.find((talk) =>
    talk.name.startsWith('Hypervisor Hierarchy'),
  );
  assert.ok(recording?.video);
  assert.ok(html.includes(`href="${recording.video}"`));
  assert.doesNotMatch(html, /<iframe|astro-island/v);
  assert.match(html, /fetchpriority="high"/v);
  assert.match(html, /alt="Cody Zuschlag wearing/v);
});

test('all speaker downloads exist and preserve PNG dimensions and transparency', async () => {
  await Promise.all(
    [
      ['-512', 512, 512],
      ['-1024', 1024, 1024],
      ['', 4030, 3675],
    ].map(async ([suffix, width, height]) => {
      const path = `/speaker/cody-zuschlag${suffix}.png`;
      assert.ok(html.includes(`href="${path}"`));
      assert.ok(html.includes(`download="cody-zuschlag-speaker${suffix}.png"`));
      const bytes = readFileSync(new URL(`../dist${path}`, import.meta.url));
      const metadata = await sharp(bytes).metadata();
      assert.equal(metadata.format, 'png');
      assert.equal(metadata.width, width);
      assert.equal(metadata.height, height);
      assert.equal(metadata.hasAlpha, true);
      assert.deepEqual(
        bytes,
        readFileSync(new URL(`../public${path}`, import.meta.url)),
      );
    }),
  );
});
