import 'dotenv/config';
import { test, expect } from '@playwright/test';

import LoginPage from '../../../pages/LoginPage.js';
import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

const marketUrls = {
  gambia: 'https://chopwin.gm',
  uganda: 'https://www.chopwin.ug',
  sierraLeone: 'https://www.chopwin.sl'
};

const baseMarketUrl = marketUrls[market];

test.describe('Promotional CTA Navigation', () => {

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

  test('50% Deposit Bonus CTA redirects to the correct promotion', async ({
    page,
    context
  }) => {
    await login(page, context);

    await page.getByRole('link', {
      name: '50% Deposit Bonus 50% Deposit'
    }).click();

    await expect(page).toHaveURL(
      `${baseMarketUrl}/article/night-owls`
    );
  });

  test('Up to 35% Cashback CTA redirects to the correct promotion', async ({
    page,
    context
  }) => {
    await login(page, context);

    await page.getByRole('link', {
      name: 'Up to 35% Cashback Up to 35%'
    }).click();

    await expect(page).toHaveURL(
      `${baseMarketUrl}/bonus/cashback`
    );
  });

  test('Free Daily Rewards CTA redirects to the correct promotion', async ({
    page,
    context
  }) => {
    await login(page, context);

    await page.getByRole('link', {
      name: 'Free Daily Rewards Free Daily'
    }).click();

    await expect(page).toHaveURL(
      `${baseMarketUrl}/article/daily-reward`
    );
  });

});