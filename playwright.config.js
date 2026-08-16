import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { markets } from './config/markets.js';

const market = process.env.MARKET || 'gambia';

if (!markets[market]) {
  throw new Error(
    `Unknown market "${market}". Available markets: ${Object.keys(markets).join(', ')}`
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
  ],

  use: {
    baseURL: markets[market].baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});