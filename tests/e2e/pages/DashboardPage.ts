import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly creditsDisplay: Locator;
  readonly newDrawButton: Locator;
  readonly drawsList: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly buyCreditsButton: Locator;
  readonly connectInstagramButton: Locator;
  readonly connectedAccounts: Locator;
  readonly statsCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.creditsDisplay = page.locator('[data-testid="credits-display"], .credits-count, text=/crédit|credit/i');
    this.newDrawButton = page.getByRole('button', { name: /nouveau tirage|new draw|créer/i });
    this.drawsList = page.locator('[data-testid="draws-list"], .draws-list');
    this.userMenu = page.locator('[data-testid="user-menu"], .user-menu, .avatar-menu');
    this.logoutButton = page.getByRole('button', { name: /déconnexion|logout|sign out/i });
    this.buyCreditsButton = page.getByRole('button', { name: /acheter|buy credits|crédits/i });
    this.connectInstagramButton = page.getByRole('button', { name: /connecter instagram|connect instagram/i });
    this.connectedAccounts = page.locator('[data-testid="connected-accounts"], .connected-accounts');
    this.statsCards = page.locator('.stat-card, .stats-card, [data-testid="stat-card"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.newDrawButton).toBeVisible({ timeout: 10000 });
  }

  async getCreditsCount(): Promise<number> {
    const text = await this.creditsDisplay.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async createNewDraw() {
    await this.newDrawButton.click();
    await expect(this.page).toHaveURL(/\/draws\/new|\/new-draw/);
  }

  async openUserMenu() {
    await this.userMenu.click();
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/$|\/auth/);
  }

  async goToBuyCredits() {
    await this.buyCreditsButton.click();
    await expect(this.page).toHaveURL(/\/pricing/);
  }

  async connectInstagram() {
    await this.connectInstagramButton.click();
  }

  async getDrawsCount(): Promise<number> {
    const draws = this.drawsList.locator('.draw-item, .draw-card, [data-testid="draw-item"]');
    return await draws.count();
  }

  async clickOnDraw(index: number) {
    const draws = this.drawsList.locator('.draw-item, .draw-card, [data-testid="draw-item"]');
    await draws.nth(index).click();
  }
}
