import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';

test('User can access Chop Spin when spins are available', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Wait until login is successful
  await expect(
    page.getByRole('link', { name: 'My Account' })
  ).toBeVisible();

  // Open Chop Spin
  await page.getByRole('button', { name: 'Chop Spin' }).first().click();

  // Verify user can spin
  await expect(
    page.getByRole('button', { name: 'Spin now' })
  ).toBeVisible();
});