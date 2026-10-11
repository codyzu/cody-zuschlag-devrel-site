import {Buffer} from 'node:buffer';
import {readFileSync} from 'node:fs';
import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Test site-owned behavior without analytics, remote fonts, or live map tiles.
const externalUrl = /^https?:\/\/(?!127\.0\.0\.1:4322(?:\/|$))/v;
const errorsByPage = new WeakMap();
const isolateExternal = async (route) => {
  const type = route.request().resourceType();
  await route.fulfill({
    status: 200,
    contentType:
      type === 'stylesheet'
        ? 'text/css'
        : type === 'image'
          ? 'image/png'
          : 'text/javascript',
    body:
      type === 'image'
        ? Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
            'base64',
          )
        : '',
  });
};

test.beforeEach(async ({page}) => {
  const errors = [];
  errorsByPage.set(page, errors);
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.route(externalUrl, isolateExternal);
});
test.afterEach(async ({page}) => {
  expect(errorsByPage.get(page)).toEqual([]);
});

test('search, resource/location toggles, empty state and reset work in the browser', async ({
  page,
}) => {
  await page.goto('/');
  const rows = page.locator('#talks .talk');
  const total = await rows.count();
  const search = page.getByRole('searchbox', {name: 'Search talks'});
  await search.fill('MÚNICH xen 2026');
  await expect(page.locator('#talks .talk:visible')).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText(`1 talk of ${total}`);
  await search.fill('no-such-talk');
  await expect(page.locator('#talk-empty')).toBeVisible();
  await expect(page.locator('#talks .talk:visible')).toHaveCount(0);
  await page.getByRole('button', {name: 'Reset filters'}).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('#talks .talk:visible')).toHaveCount(total);
  for (const name of ['Video', 'Slides', 'Europe', 'USA']) {
    const button = page.getByRole('button', {name, exact: true});
    await button.focus();
    await button.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  }

  const matching = await rows.evaluateAll(
    (elements) =>
      elements.filter(
        (element) =>
          element.dataset.video === 'true' &&
          element.dataset.slides === 'true' &&
          ['Europe', 'USA'].includes(element.dataset.region),
      ).length,
  );
  expect(matching).toBeGreaterThan(0);
  await expect(page.locator('#talks .talk:visible')).toHaveCount(matching);
  expect(
    await page
      .locator('#talks .talk[hidden]')
      .evaluateAll((elements) =>
        elements.every(
          (element) => element.getBoundingClientRect().height === 0,
        ),
      ),
  ).toBe(true);
  if (page.viewportSize().width >= 768) {
    const columns = await page
      .locator('#talks .talk:visible')
      .evaluateAll((elements) =>
        elements.map(
          (element) => element.querySelector('.date').getBoundingClientRect().x,
        ),
      );
    expect(Math.max(...columns) - Math.min(...columns)).toBeLessThan(1);
  }

  await expect(page.locator('.talk-highlights > li')).toHaveCount(3);
  await page.getByRole('button', {name: 'Reset filters'}).click();
  await expect(page.locator('#talks .talk:visible')).toHaveCount(total);
  await expect(page.locator('#talk-empty')).toBeHidden();
  await expect(page.locator('#talk-filters [aria-pressed="true"]')).toHaveCount(
    0,
  );
});

for (const path of ['/', '/speaking']) {
  test(`${path} has accessible content, keyboard skip navigation and no overflow`, async ({
    page,
  }) => {
    await page.goto(path);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', {name: 'Skip to content'});
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    expect(
      await skip.evaluate(
        (element) => globalThis.getComputedStyle(element).outlineStyle,
      ),
    ).not.toBe('none');
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          globalThis.document.documentElement.scrollWidth <=
          globalThis.innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('both pages remain readable and connected without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: test.info().project.use.viewport,
  });
  try {
    const page = await context.newPage();
    await page.route(externalUrl, isolateExternal);
    await page.goto(baseURL);
    await expect(page.locator('#talk-filters')).toBeHidden();
    expect(await page.locator('#talks .talk').count()).toBeGreaterThan(0);
    await expect(page.locator('#talks .talk[hidden]')).toHaveCount(0);
    await page.locator('a[href="#articles"]').first().click();
    await expect(page).toHaveURL(/#articles$/v);
    await expect(page.locator('#articles')).toBeInViewport();
    await page.getByText('Speaking cities and counts', {exact: true}).click();
    await expect(page.locator('[data-map-city]').first()).toBeVisible();
    await page.locator('a[href="/speaking"]').first().click();
    await expect(page.getByRole('heading', {name: 'Short bio'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Long bio'})).toBeVisible();
    await page
      .getByRole('link', {name: 'Browse all talks & recordings'})
      .click();
    await expect(page).toHaveURL(/\/#talks$/v);
    await expect(page.locator('#talks')).toBeInViewport();
  } finally {
    await context.close();
  }
});

test('speaker photo downloads match the published files', async ({page}) => {
  await page.goto('/speaking');
  await expect(
    page.getByRole('link', {name: 'Invite me to speak'}),
  ).toHaveAttribute('href', /^mailto:/v);
  for (const size of ['small', 'medium', 'original']) {
    const link = page.getByRole('link', {name: `Download ${size} photo`});
    const path = await link.getAttribute('href');
    await link.focus();
    const pending = page.waitForEvent('download');
    await link.press('Enter');
    const download = await pending;
    expect(download.suggestedFilename()).toBe(
      await link.getAttribute('download'),
    );
    expect(readFileSync(await download.path())).toEqual(
      readFileSync(new URL(`../../public${path}`, import.meta.url)),
    );
  }
});

test('map loads near the viewport and markers work by keyboard', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#speaking-map')).toBeHidden();
  await page.locator('#speaking-map-wrapper').scrollIntoViewIfNeeded();
  const home = page.getByRole('button', {name: 'Annecy, France · Home base'});
  await expect(home).toBeVisible();
  await home.focus();
  await home.press('Enter');
  await expect(page.locator('.map-popup-title')).toHaveText('Annecy, France');
  await expect(page.locator('.map-popup-detail')).toHaveText('Home base');
  // Scan the settled popup rather than its partially transparent fade-in.
  await expect(page.locator('.leaflet-popup')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('button', {name: 'Zoom in'})).toBeVisible();
  const results = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('failed map module leaves the native city list and external link usable', async ({
  page,
}) => {
  const mapModule = /\/speaking-map\.[^\/]+\.js$/v;
  await page.route(mapModule, (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: 'throw new Error("Simulated map load failure");',
    }),
  );
  await page.goto('/');
  const failedModule = page.waitForResponse(mapModule);
  await page.locator('#speaking-map-wrapper').scrollIntoViewIfNeeded();
  await failedModule;
  await page.getByText('Speaking cities and counts', {exact: true}).click();
  await expect(page.locator('[data-map-city]').first()).toBeVisible();
  await expect(
    page.getByRole('link', {name: 'View Annecy on OpenStreetMap'}),
  ).toBeVisible();
  await expect(page.locator('#speaking-map')).toBeHidden();
});
