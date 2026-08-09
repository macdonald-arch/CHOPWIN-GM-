import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';

test('User can access Bonus page', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open Bonus
  await page.getByRole('button', {
    name: 'Bonus',
    exact: true
  }).click();

  // Verify bonus details button exists
  await expect(
    page.getByRole('button', { name: 'View Details' }).first()
  ).toBeVisible();
});

test('User can open Bonus details', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open Bonus
  await page.getByRole('button', {
    name: 'Bonus',
    exact: true
  }).click();

  // Open bonus details
  await page.getByRole('button', {
    name: 'View Details'
  }).click();

  // Verify bonus details content is visible
  await expect(
    page.locator('.card-content').first()
  ).toBeVisible({ timeout: 10000 });
});