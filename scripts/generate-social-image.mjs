import {Buffer} from 'node:buffer';
import sharp from 'sharp';
import uno from '../uno.config.ts';

// Keep this card in the site's palette and reuse the approved hero photograph.
const {colors} = uno.theme;
const photograph = await sharp(
  new URL('../src/images/reactsummit_closeup.jpeg', import.meta.url).pathname,
)
  .extract({left: 730, top: 150, width: 700, height: 850})
  .resize(520, 630)
  .toBuffer();
const typography = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="fade">
      <stop stop-color="${colors.background}"/>
      <stop offset="1" stop-color="${colors.background}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="680" height="630" fill="${colors.background}"/>
  <rect x="680" width="65" height="630" fill="url(#fade)"/>
  <rect x="64" y="76" width="72" height="6" rx="3" fill="${colors.highlight}"/>
  <g font-family="Roboto, Arial, sans-serif" fill="${colors.primary}">
    <text x="64" y="176" font-size="56" font-weight="700">Cody Zuschlag</text>
    <text x="64" y="263" font-size="34">Community Manager</text>
    <text x="64" y="315" font-size="44" font-weight="700" fill="${colors.highlight}">Xen Project</text>
    <text x="64" y="392" font-size="27">Open-source community builder</text>
    <text x="64" y="439" font-size="25">International speaker</text>
    <text x="64" y="476" font-size="25">University instructor</text>
    <text x="64" y="560" font-size="22" fill="${colors.secondary}">devrel.codyfactory.eu</text>
  </g>
</svg>`);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: colors.background,
  },
})
  .composite([
    {input: photograph, left: 680, top: 0},
    {input: typography, left: 0, top: 0},
  ])
  .jpeg({quality: 90, mozjpeg: true})
  .toFile(new URL('../public/social-sharing.jpg', import.meta.url).pathname);
