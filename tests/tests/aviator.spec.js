import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';

test('User can open Aviator game', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open Aviator
  await page.getByRole('link', { name: 'aviator' }).click();
  await page.getByRole('button', { name: 'Real Play' }).first().click();

  // If launch popup appears, close it
  const closeButton = page.getByRole('button', { name: 'Close' });

  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }

  // Verify Aviator loaded
  const aviatorGame = page
    .locator('iframe[title="Aviator"]')
    .contentFrame()
    .locator('iframe[title="gameIFrame"]')
    .contentFrame()
    .locator('.dom-container');

  await expect(aviatorGame).toBeVisible({ timeout: 30000 });
});