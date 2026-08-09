import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';

test('User can open Chicken X game', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Allow homepage to finish rendering
  await page.waitForTimeout(3000);

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

  // Verify Chicken X is available
  await expect(chickenXButton).toHaveCount(1, {
    timeout: 5000
  });

  // Bring Chicken X into view
  await chickenXButton.scrollIntoViewIfNeeded();

  // Open Chicken X
  await chickenXButton.click();

  // Verify game iframe loaded
  await expect(
    page.locator('iframe[title="game-frame"]')
  ).toBeVisible({
    timeout: 15000
  });
});