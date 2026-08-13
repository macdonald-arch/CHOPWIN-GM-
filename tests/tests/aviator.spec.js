import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import { markets } from '../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

test('User can open Aviator game', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  try {
    await login.navigate();
  } catch (error) {
    console.log('Initial navigation failed, retrying...');
    await page.waitForTimeout(2000);
    await login.navigate();
  }

  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  if (market === 'uganda') {
    // Open Aviator
    await page.getByRole('button', {
      name: 'Aviator',
      exact: true
    }).click();

    // Verify Aviator game frame loaded
    const gameFrame = page.locator(
      'iframe[title="game-frame"]'
    );

    await expect(gameFrame).toBeVisible({
      timeout: 30000
    });

    // Verify the game frame points to Spribe Aviator
    await expect(gameFrame).toHaveAttribute(
      'src',
      /launch\.spribegaming\.com\/aviator/,
      { timeout: 30000 }
    );

  } else {
    // Gambia Aviator flow
    await page.getByRole('link', {
      name: 'aviator'
    }).click();

    await page.getByRole('button', {
      name: 'Real Play'
    }).first().click();

    const closeButton = page.getByRole('button', {
      name: 'Close'
    });

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }

    const aviatorGame = page
      .locator('iframe[title="game-frame"]')
      .contentFrame()
      .locator('iframe[title="gameIFrame"]')
      .contentFrame()
      .locator('.dom-container');

    await expect(aviatorGame).toBeVisible({
      timeout: 30000
    });
  }
});