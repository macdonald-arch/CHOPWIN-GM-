import 'dotenv/config';

import { test, expect } from '@playwright/test';

import LoginPage from '../../../pages/LoginPage.js';
import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

test.describe('Game Categories Navigation', () => {

  async function login(page, context) {
    await context.clearCookies();

    const login = new LoginPage(page);

    await login.navigate();
    await login.openLoginForm();

    await login.login(
      credentials.phone,
      credentials.password
    );
  }

  test('User can navigate to New category', async ({ page, context }) => {

    await login(page, context);

    await page.getByLabel('New').click();

    await expect(page).toHaveURL(
      /\/casino\/new\/home$/
    );
  });

  test('User can navigate to Crash category', async ({ page, context }) => {

    await login(page, context);

    await page.getByLabel('Crash', {
      exact: true
    }).click();

    await expect(page).toHaveURL(
      /\/casino\/crash\/home$/
    );
  });

  test('User can navigate to Instants category', async ({ page, context }) => {

    await login(page, context);

    await page.getByLabel('Instants').click();

    await expect(page).toHaveURL(
      /\/casino\/instants\/home$/
    );
  });

  test('User can navigate to Vegas category', async ({ page, context }) => {

    await login(page, context);

    await page.getByLabel('Vegas').click();

    await expect(page).toHaveURL(
      /\/casino\/vegas\/home$/
    );
  });

});