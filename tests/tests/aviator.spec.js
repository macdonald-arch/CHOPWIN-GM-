import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import { markets } from '../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

test('User can open Aviator game', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  // Sierra Leone
  if (market === 'sierraLeone') {

    // Return to homepage
    await page.goto('https://www.chopwin.sl/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Open Aviator
    await page.locator('.play-btn').first().click({
      force: true
    });

    // Verify Aviator page opened
    await expect(page).toHaveURL(
      /\/casino\/game\/aviator/,
      {
        timeout: 30000
      }
    );

    // Close the game
    const closeButton = page.getByRole('button', {
      name: 'Close'
    }).first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }

  } else if (market === 'uganda') {

    // Open Aviator
    await page.getByRole('button', {
      name: 'Aviator',
      exact: true
    }).first().click();

    // Verify Aviator game opened
    await expect(
      page.locator('iframe[title="game-frame"]')
    ).toBeVisible({
      timeout: 30000
    });

  } else {

    // Gambia
    await page.getByRole('link', {
      name: 'aviator'
    }).click();

    // Start real play
    await page.getByRole('button', {
      name: 'Real Play'
    }).first().click();

    // Verify Aviator page opened
    await expect(page).toHaveURL(
      /\/casino\/game\/aviator/,
      {
        timeout: 30000
      }
    );

    // Close the game
    const closeButton = page.getByRole('button', {
      name: 'Close'
    }).first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }
});