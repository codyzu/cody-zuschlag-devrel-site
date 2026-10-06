import assert from 'node:assert/strict';
import {test} from 'node:test';
import {parseGalleryFilenames} from '../src/gallery/gallery-filenames.ts';

test('gallery filenames supply numeric order, sentence-case descriptions, and optional layout', () => {
  assert.deepEqual(
    parseGalleryFilenames([
      './10_cody-at-nodeconf-eu_portrait.png',
      './2_cody-on-stage_big.jpg',
      './01_cody-answering-a-question.jpeg',
    ]),
    [
      {
        path: './01_cody-answering-a-question.jpeg',
        order: 1,
        alt: 'Cody answering a question',
        aspectRatio: '4/3',
        featured: false,
      },
      {
        path: './2_cody-on-stage_big.jpg',
        order: 2,
        alt: 'Cody on stage',
        aspectRatio: '4/3',
        featured: true,
      },
      {
        path: './10_cody-at-nodeconf-eu_portrait.png',
        order: 10,
        alt: 'Cody at nodeconf eu',
        aspectRatio: '3/4',
        featured: false,
      },
    ],
  );
});

test('gallery filename mistakes fail clearly instead of silently changing metadata', () => {
  for (const filename of [
    '01_Cody-on-stage.jpg',
    '01_cody-on-stage.JPG',
    '01_.jpg',
    '01_cody--on-stage.jpg',
    '01_cody_on_stage.jpg',
    '01_cody-on-stage_wide.jpg',
    '01_cody-on-stage_big_portrait.jpg',
    'cody-on-stage.jpg',
    '01_cody-on-stage.gif',
  ]) {
    assert.throws(
      () => parseGalleryFilenames([filename]),
      /Invalid gallery filename/v,
    );
  }

  for (const filename of ['00_cody.jpg', '9007199254740992_cody.jpg']) {
    assert.throws(
      () => parseGalleryFilenames([filename]),
      /Invalid gallery order/v,
    );
  }

  assert.throws(
    () => parseGalleryFilenames(['01_cody.jpg', '1_audience.png']),
    /Duplicate gallery order 1/v,
  );
});
