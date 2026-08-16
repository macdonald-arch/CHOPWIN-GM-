import { expect } from '@playwright/test';
import 'dotenv/config';

class LoginPage {
  constructor(page) {
    this.page = page;

    const market = process.env.MARKET || 'gambia';

    // LOGIN LOCATORS
    if (market === 'sierraLeone') {
      this.loginLink = page.getByRole('link', {
        name: 'Login'
      });

      this.loginButton = page.getByRole('button', {
        name: 'Login'
      });

      this.errorMessage = page.getByText('Invalid credentials');
    } else {
      this.loginLink = page.getByRole('link', {
        name: 'Log in'
      });

      this.loginButton = page.getByRole('button', {
        name: 'Log in'
      });

      this.errorMessage = page.getByText(/invalid credentials/i);
    }

    this.phoneInput = page.getByRole('textbox', {
      name: 'Phone Number'
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password'
    });
  }

  // NAVIGATE
  async navigate() {
    const market = process.env.MARKET || 'gambia';

    if (market === 'sierraLeone') {
      try {
        await this.page.goto('https://www.chopwin.sl/', {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
      } catch (error) {
        console.log(
          'Sierra Leone navigation timed out, continuing...'
        );
      }

      // Give homepage time to render
      await this.page.waitForTimeout(3000);

      return;
    }

    // Gambia / Uganda
    try {
      await this.page.goto('/', {
        waitUntil: 'commit',
        timeout: 20000
      });
    } catch (error) {
      console.log(
        'Initial navigation timed out, continuing...'
      );
    }

    // Allow the homepage to render
    await this.page.waitForTimeout(2000);
  }

  // OPEN LOGIN FORM
  async openLoginForm() {
    const market = process.env.MARKET || 'gambia';

    // Close blocking popup/overlay if one appears
    const closeButton = this.page.getByRole('button', {
      name: 'Close'
    }).first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click({
        force: true
      }).catch(() => {});

      await this.page.waitForTimeout(500);
    }

    // Wait for Login link
    if (market === 'sierraLeone') {
      await this.loginLink.waitFor({
        state: 'visible',
        timeout: 20000
      });

      await this.loginLink.click({
        force: true
      });
    } else {
      await this.loginLink.waitFor({
        state: 'visible',
        timeout: 15000
      });

      await this.loginLink.click({
        force: true
      });
    }

    // Wait for login form
    await this.phoneInput.waitFor({
      state: 'visible',
      timeout: 15000
    });
  }

  // LOGIN
  async login(phone, password) {
    await this.phoneInput.waitFor({
      state: 'visible',
      timeout: 15000
    });

    await this.phoneInput.fill(phone);

    await this.passwordInput.waitFor({
      state: 'visible',
      timeout: 15000
    });

    await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  // REQUIRED FIELD VALIDATION
  async requiredFieldBlank(password) {
    await this.passwordInput.fill(password);

    await expect(this.loginButton).toBeDisabled();
  }

  // CHECK IF LOGGED IN
  async isLoggedIn() {
    return await this.page
      .locator(
        '[class*="balance"], [class*="dashboard"], [class*="account"]'
      )
      .isVisible();
  }
}

export default LoginPage;