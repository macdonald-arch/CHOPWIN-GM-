import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';
import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

test('User can open Chicken X game', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  // Allow homepage to finish rendering
  await page.waitForTimeout(3000);

  // Uganda: open Crash category before locating Chicken X
  if (market === 'uganda') {
    await page.getByLabel('Crash').click();
  }

  // Locate Chicken X
  const chickenXButton = page.getByRole('button', {
    name: 'Chicken X',
    exact: true
  });

  // Scroll down to load/reveal Chicken X
  for (let i = 1; i <= 10; i++) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1000);

    if (await chickenXButton.count() > 0) {
      break;
    }
  }

  // Bring Chicken X into view
  await chickenXButton.first().scrollIntoViewIfNeeded();

  // Open Chicken X
  await chickenXButton.first().click();

  // Verify game iframe loaded
  await expect(
    page.locator('iframe[title="game-frame"]')
  ).toBeVisible({
    timeout: 15000
  });
});