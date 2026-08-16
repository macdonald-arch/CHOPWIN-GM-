import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];
const marketConfig = markets[market];

async function loginSierraLeone(page) {
  // Open homepage
  await page.goto('https://www.chopwin.sl/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Login
  await page.getByRole('link', {
    name: 'Login'
  }).click();

  await page.getByRole('textbox', {
    name: 'Phone Number'
  }).fill(credentials.phone);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(credentials.password);

  await page.getByRole('button', {
    name: 'Login'
  }).click();

  // Wait for login to complete
  await expect(
    page.getByRole('button', {
      name: 'Toggle wallet dropdown'
    })
  ).toBeVisible({
    timeout: 20000
  });

  // Match the Codegen flow: return to homepage after login
  await page.goto('https://www.chopwin.sl/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Wait for authenticated homepage to render again
  await expect(
    page.getByRole('button', {
      name: 'Toggle wallet dropdown'
    })
  ).toBeVisible({
    timeout: 20000
  });
}

async function loginOtherMarket(page) {
  await page.goto('/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  const loginLink = page.getByRole('link', {
    name: 'Log in'
  });

  await loginLink.click();

  await page.getByRole('textbox', {
    name: 'Phone Number'
  }).fill(credentials.phone);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(credentials.password);

  await page.getByRole('button', {
    name: 'Log in'
  }).click();
}

async function openMyAccount(page) {
  // Wait for wallet to be available after authentication
  const walletToggle = page.getByRole('button', {
    name: 'Toggle wallet dropdown'
  });

  await expect(walletToggle).toBeVisible({
    timeout: 20000
  });

  await walletToggle.click();

  // Open My Account
  const myAccountLink = page.getByRole('link', {
    name: 'My Account'
  }).nth(1);

  await expect(myAccountLink).toBeVisible({
    timeout: 15000
  });

  await myAccountLink.click();
}


test('User can access Withdrawal page and view withdrawal form', async ({ page }) => {

  if (market === 'sierraLeone') {
    await loginSierraLeone(page);
  } else {
    await loginOtherMarket(page);
  }

  // Open My Account
  await openMyAccount(page);

  // Open Withdrawal
  await page.getByRole('button', {
    name: 'Withdraw'
  }).click();

  // Select withdrawal method
  await page.getByRole('button', {
    name: market === 'sierraLeone'
      ? 'Afrimoney Afrimoney'
      : marketConfig.withdrawalMethod
  }).click();

  // Verify withdrawal amount field
  await expect(
    page.getByRole('textbox', {
      name: 'Withdraw amount'
    })
  ).toBeVisible();
});


test('User cannot withdraw without meeting deposit requirement', async ({ page }) => {

  if (market === 'sierraLeone') {
    await loginSierraLeone(page);
  } else {
    await loginOtherMarket(page);
  }

  // Open My Account
  await openMyAccount(page);

  // Open Withdrawal
  await page.getByRole('button', {
    name: 'Withdraw'
  }).click();

  // Select withdrawal method
  await page.getByRole('button', {
    name: market === 'sierraLeone'
      ? 'Afrimoney Afrimoney'
      : marketConfig.withdrawalMethod
  }).click();

  // Sierra Leone withdrawal flow
  if (market === 'sierraLeone') {

    await page.getByRole('button', {
      name: '10',
      exact: true
    }).click();

    // Close popup if it appears
    const closeButton = page.getByRole('button', {
      name: 'Close'
    }).first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }

    // Verify validation
    await expect(
      page.getByText(/Amount is bigger than your/i)
    ).toBeVisible();

  } else if (market === 'uganda') {

    await page.getByRole('button', {
      name: marketConfig.withdrawalAmount,
      exact: true
    }).click();

    await expect(
      page.getByText(/Amount is bigger than your/i)
    ).toBeVisible();

  } else {

    // Gambia
    await page.getByRole('button', {
      name: marketConfig.withdrawalAmount,
      exact: true
    }).click();

    await page.getByRole('button', {
      name: 'Continue'
    }).click();

    await expect(
      page.getByText('Deposit at least 50.00 Dalasi')
    ).toBeVisible();
  }
});