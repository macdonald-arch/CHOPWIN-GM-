import { expect } from '@playwright/test';

class LoginPage {
  constructor(page) {
    this.page = page;

    // LOGIN LOCATORS (real selectors from Playwright codegen)
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });

    // ERROR
    this.errorMessage = page.locator("text=Nom d'utilisateur ou mot de");
  }

  // NAVIGATE
  async navigate() {
    await this.page.goto('https://chopwin.gm/');
  }

  // OPEN LOGIN FORM
  async openLoginForm() {
    await this.loginLink.click();
  }

  // PASSCODE (DYNAMIC - SAFE)
  async enterPasscode(code) {
    const passcodeInput = this.page.getByRole('textbox', { name: /passcode/i });
    const unlockButton = this.page.getByRole('button', { name: /unlock/i });

    await passcodeInput.fill(code);
    await unlockButton.click();
  }

  // LOGIN (valid or invalid — pass the data you want in the test)
  async login(phone, password) {
    await this.phoneInput.fill(phone);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // REQUIRED FIELD VALIDATION - leave phone blank
  async requiredFieldBlank(password) {
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeDisabled();
  }

  // CHECK IF LOGGED IN
  async isLoggedIn() {
    return await this.page
      .locator('[class*="balance"], [class*="dashboard"], [class*="account"]')
      .isVisible();
  }
}

export default LoginPage;