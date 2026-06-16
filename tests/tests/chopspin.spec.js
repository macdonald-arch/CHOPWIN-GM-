import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';

test('User can open Chop Spin modal', async ({ page }) => {
  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  await expect(
    page.getByRole('link', { name: 'My Account' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Chop Spin' }).first().click();

  await expect(
    page.getByRole('button', { name: 'Spin now' })
  ).toBeVisible();
});

test('User can access Chop Spin feature', async ({ page }) => {
  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  await expect(
    page.getByRole('link', { name: 'My Account' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Chop Spin' }).first().click();

  // Verify Chop Spin interface loaded
  await expect(
    page.getByRole('button', { name: 'chopwin icon' })
  ).toBeVisible();

  // Attempt interaction
  await page.getByRole('button', { name: 'chopwin icon' }).click();
});