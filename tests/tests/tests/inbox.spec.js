import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';

test('User can access Inbox and view inbox page', async ({ page }) => {
  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open Inbox
  await page.getByLabel('Inbox').click();

  // Verify Inbox page loaded
  await expect(
    page.getByRole('heading', {
      name: 'Inbox is currently empty',
      exact: true
    })
  ).toBeVisible();

  // Verify filters are visible
  await expect(
    page.getByRole('button', { name: 'All', exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Unread', exact: true })
  ).toBeVisible();
});