import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';

test('User can open Chicken X game', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open Chicken X
  await page.locator('.hover-overlay.is-hovered > .play-btn').click();

  // Verify game iframe loaded
  await expect(
    page.locator('iframe[title="game-frame"]')
  ).toBeVisible();
});