import { Page, Locator, expect } from '@playwright/test';

export class DrawPage {
  readonly page: Page;
  
  // Configuration step
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly winnersInput: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  
  // Participants step
  readonly manualModeButton: Locator;
  readonly instagramModeButton: Locator;
  readonly participantsTextarea: Locator;
  readonly importCsvButton: Locator;
  readonly instagramUrlInput: Locator;
  readonly fetchParticipantsButton: Locator;
  readonly participantsList: Locator;
  readonly participantsCount: Locator;
  
  // Options step
  readonly allowDuplicatesCheckbox: Locator;
  readonly animationCheckbox: Locator;
  readonly substitutesInput: Locator;
  
  // Execution
  readonly createDrawButton: Locator;
  readonly executeDrawButton: Locator;
  readonly confirmExecuteButton: Locator;
  readonly drawAnimation: Locator;
  
  // Results
  readonly winnersDisplay: Locator;
  readonly certificateButton: Locator;
  readonly exportButton: Locator;
  readonly shareButton: Locator;
  readonly verificationHash: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Configuration
    this.titleInput = page.getByRole('textbox', { name: /titre|title/i });
    this.descriptionInput = page.getByRole('textbox', { name: /description/i });
    this.winnersInput = page.getByRole('spinbutton', { name: /gagnants|winners|nombre/i });
    this.nextButton = page.getByRole('button', { name: /suivant|next|continuer|continue/i });
    this.backButton = page.getByRole('button', { name: /précédent|back|retour/i });
    
    // Participants
    this.manualModeButton = page.getByRole('button', { name: /manuel|manual/i });
    this.instagramModeButton = page.getByRole('button', { name: /instagram/i });
    this.participantsTextarea = page.locator('textarea[name="participants"], [data-testid="participants-input"]');
    this.importCsvButton = page.getByRole('button', { name: /importer csv|import csv/i });
    this.instagramUrlInput = page.getByRole('textbox', { name: /url|lien|link/i });
    this.fetchParticipantsButton = page.getByRole('button', { name: /récupérer|fetch|charger|load/i });
    this.participantsList = page.locator('[data-testid="participants-list"], .participants-list');
    this.participantsCount = page.locator('[data-testid="participants-count"], .participants-count');
    
    // Options
    this.allowDuplicatesCheckbox = page.getByRole('checkbox', { name: /doublons|duplicates/i });
    this.animationCheckbox = page.getByRole('checkbox', { name: /animation/i });
    this.substitutesInput = page.getByRole('spinbutton', { name: /suppléants|substitutes/i });
    
    // Execution
    this.createDrawButton = page.getByRole('button', { name: /créer le tirage|create draw/i });
    this.executeDrawButton = page.getByRole('button', { name: /lancer|execute|tirer|start draw/i });
    this.confirmExecuteButton = page.getByRole('button', { name: /confirmer|confirm/i });
    this.drawAnimation = page.locator('[data-testid="draw-animation"], .draw-animation');
    
    // Results
    this.winnersDisplay = page.locator('[data-testid="winners-list"], .winners-list, .winners');
    this.certificateButton = page.getByRole('button', { name: /certificat|certificate|pdf/i });
    this.exportButton = page.getByRole('button', { name: /exporter|export/i });
    this.shareButton = page.getByRole('button', { name: /partager|share/i });
    this.verificationHash = page.locator('[data-testid="verification-hash"], .hash-display');
  }

  async goto() {
    await this.page.goto('/draws/new');
  }

  async gotoExisting(drawId: string) {
    await this.page.goto(`/draws/${drawId}`);
  }

  async fillConfiguration(config: { title: string; description?: string; numberOfWinners: number }) {
    await this.titleInput.fill(config.title);
    if (config.description) {
      await this.descriptionInput.fill(config.description);
    }
    await this.winnersInput.fill(config.numberOfWinners.toString());
  }

  async addManualParticipants(participants: { name: string; identifier: string }[]) {
    await this.manualModeButton.click();
    const text = participants.map(p => `${p.name}, ${p.identifier}`).join('\n');
    await this.participantsTextarea.fill(text);
  }

  async addInstagramPost(url: string) {
    await this.instagramModeButton.click();
    await this.instagramUrlInput.fill(url);
    await this.fetchParticipantsButton.click();
  }

  async goToNextStep() {
    await this.nextButton.click();
  }

  async createDraw() {
    await this.createDrawButton.click();
    await expect(this.page).toHaveURL(/\/draws\/[a-f0-9-]+/);
  }

  async executeDraw() {
    await this.executeDrawButton.click();
    
    // Wait for confirmation modal
    await expect(this.confirmExecuteButton).toBeVisible({ timeout: 5000 });
    
    // Confirm
    await this.confirmExecuteButton.click();
    
    // Wait for animation to complete or results to show
    await expect(this.winnersDisplay).toBeVisible({ timeout: 30000 });
  }

  async getWinners(): Promise<string[]> {
    const winners: string[] = [];
    const winnerElements = this.winnersDisplay.locator('.winner-name, .winner-item');
    const count = await winnerElements.count();
    
    for (let i = 0; i < count; i++) {
      const text = await winnerElements.nth(i).textContent();
      if (text) winners.push(text.trim());
    }
    
    return winners;
  }

  async downloadCertificate() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.certificateButton.click(),
    ]);
    return download;
  }

  async getVerificationHash(): Promise<string> {
    const text = await this.verificationHash.textContent();
    return text?.trim() || '';
  }

  async shareResults() {
    await this.shareButton.click();
  }
}
