import { expect } from '@playwright/test';

class LoginPage {
  constructor(page) {
    this.page = page;

    // LOGIN LOCATORS
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });

    // ERROR MESSAGE
    this.errorMessage = page.getByText(/invalid credentials/i);
  }

  // NAVIGATE
  async navigate() {
    await this.page.goto('https://chopwin.gm/');
  }

  // OPEN LOGIN FORM
  async openLoginForm() {
    await this.loginLink.click();
  }

  // LOGIN
  async login(phone, password) {
    await this.phoneInput.fill(phone);
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
      .locator('[class*="balance"], [class*="dashboard"], [class*="account"]')
      .isVisible();
  }
}

export default LoginPage;