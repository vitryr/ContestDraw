import { Resend } from 'resend';
import config from '../config/config';
import { logger } from '../utils/logger';

/**
 * Modern email templates for Cleack
 * Using Resend API for reliable email delivery
 */

// Brand colors
const COLORS = {
  primary: '#6366f1',      // Indigo
  primaryDark: '#4f46e5',
  secondary: '#ec4899',    // Pink
  secondaryDark: '#db2777',
  success: '#10b981',      // Emerald
  warning: '#f59e0b',      // Amber
  text: '#1f2937',         // Gray 800
  textLight: '#6b7280',    // Gray 500
  background: '#f9fafb',   // Gray 50
  white: '#ffffff',
  border: '#e5e7eb',       // Gray 200
};

/**
 * Base email template wrapper
 */
function baseTemplate(content: string, previewText: string = ''): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Cleack</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: ${COLORS.background};
      color: ${COLORS.text};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .card {
      background: ${COLORS.white};
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      padding: 32px;
      text-align: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: ${COLORS.white};
      letter-spacing: -0.5px;
    }
    
    .logo-icon {
      display: inline-block;
      margin-right: 8px;
    }
    
    .content {
      padding: 40px 32px;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: ${COLORS.text};
      margin-bottom: 16px;
    }
    
    p {
      font-size: 16px;
      color: ${COLORS.textLight};
      margin-bottom: 16px;
    }
    
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
      color: ${COLORS.white} !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryDark} 100%);
      box-shadow: 0 4px 14px 0 rgba(236, 72, 153, 0.4);
    }
    
    .btn-success {
      background: linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%);
      box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.4);
    }
    
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .divider {
      height: 1px;
      background: ${COLORS.border};
      margin: 24px 0;
    }
    
    .code-box {
      background: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 8px;
      padding: 16px;
      font-family: monospace;
      font-size: 14px;
      word-break: break-all;
      color: ${COLORS.textLight};
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 24px 0;
    }
    
    .feature-list li {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid ${COLORS.border};
    }
    
    .feature-list li:last-child {
      border-bottom: none;
    }
    
    .feature-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      font-size: 16px;
    }
    
    .footer {
      padding: 24px 32px;
      background: ${COLORS.background};
      text-align: center;
      border-top: 1px solid ${COLORS.border};
    }
    
    .footer p {
      font-size: 14px;
      color: ${COLORS.textLight};
      margin-bottom: 8px;
    }
    
    .social-links {
      margin: 16px 0;
    }
    
    .social-links a {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: ${COLORS.white};
      border-radius: 50%;
      margin: 0 6px;
      line-height: 36px;
      text-decoration: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .highlight-box {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      border-left: 4px solid ${COLORS.primary};
    }
    
    .winner-badge {
      display: inline-block;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: ${COLORS.white};
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      margin: 8px 4px;
    }
    
    @media only screen and (max-width: 600px) {
      .container { padding: 20px 12px; }
      .content { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      h1 { font-size: 20px; }
      .btn { padding: 12px 24px; font-size: 14px; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">
          <span class="logo-icon">🎲</span>
          Cleack
        </div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <div class="social-links">
          <a href="https://twitter.com/cleack" title="Twitter">𝕏</a>
          <a href="https://instagram.com/cleack" title="Instagram">📷</a>
          <a href="https://facebook.com/cleack" title="Facebook">f</a>
        </div>
        <p>© ${new Date().getFullYear()} Cleack. Tous droits réservés.</p>
        <p style="font-size: 12px;">Tirages au sort transparents et vérifiables</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Email Templates
 */
const templates = {
  welcome: (name: string) => baseTemplate(`
    <h1>Bienvenue sur Cleack, ${name} ! 👋</h1>
    <p>Nous sommes ravis de vous accueillir sur notre plateforme de tirages au sort professionnels.</p>
    
    <div class="highlight-box">
      <p style="margin: 0; font-weight: 600; color: ${COLORS.text};">
        🎉 Votre compte est prêt ! Commencez dès maintenant à organiser des tirages au sort équitables et transparents.
      </p>
    </div>
    
    <h2 style="font-size: 18px; margin-top: 32px; margin-bottom: 16px;">Ce que vous pouvez faire :</h2>
    <ul class="feature-list">
      <li>
        <span class="feature-icon">🔗</span>
        <span>Connecter vos réseaux sociaux (Instagram, Facebook, TikTok, YouTube)</span>
      </li>
      <li>
        <span class="feature-icon">📥</span>
        <span>Importer automatiquement les participants depuis vos posts</span>
      </li>
      <li>
        <span class="feature-icon">🎲</span>
        <span>Effectuer des tirages cryptographiquement sécurisés</span>
      </li>
      <li>
        <span class="feature-icon">📜</span>
        <span>Générer des certificats d'authenticité</span>
      </li>
      <li>
        <span class="feature-icon">📊</span>
        <span>Partager et exporter vos résultats</span>
      </li>
    </ul>
    
    <div class="cta-container">
      <a href="${config.server.frontendUrl}/dashboard" class="btn">Accéder à mon tableau de bord</a>
    </div>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px;">
      Des questions ? Notre équipe est là pour vous aider à <a href="mailto:support@cleack.io" style="color: ${COLORS.primary};">support@cleack.io</a>
    </p>
  `, `Bienvenue ${name} ! Votre compte Cleack est prêt.`),

  emailVerification: (token: string) => {
    const verificationUrl = `${config.server.frontendUrl}/verify-email?token=${token}`;
    return baseTemplate(`
      <h1>Vérifiez votre adresse email ✉️</h1>
      <p>Merci de vous être inscrit sur Cleack ! Pour finaliser votre inscription, veuillez confirmer votre adresse email.</p>
      
      <div class="cta-container">
        <a href="${verificationUrl}" class="btn">Vérifier mon email</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
      <div class="code-box">${verificationUrl}</div>
      
      <p style="font-size: 14px; margin-top: 24px; color: ${COLORS.textLight};">
        ⏱️ Ce lien expire dans <strong>24 heures</strong>.<br>
        Si vous n'avez pas créé de compte, ignorez simplement cet email.
      </p>
    `, 'Confirmez votre email pour activer votre compte Cleack');
  },

  passwordReset: (token: string) => {
    const resetUrl = `${config.server.frontendUrl}/reset-password?token=${token}`;
    return baseTemplate(`
      <h1>Réinitialisation de mot de passe 🔐</h1>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau.</p>
      
      <div class="cta-container">
        <a href="${resetUrl}" class="btn btn-secondary">Réinitialiser mon mot de passe</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
      <div class="code-box">${resetUrl}</div>
      
      <div class="highlight-box" style="border-left-color: ${COLORS.warning}; background: rgba(245, 158, 11, 0.1);">
        <p style="margin: 0; font-size: 14px;">
          ⚠️ Ce lien expire dans <strong>1 heure</strong>.<br>
          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email ou contactez-nous.
        </p>
      </div>
    `, 'Réinitialisez votre mot de passe Cleack');
  },

  drawResults: (drawTitle: string, drawId: string, winners: string[], totalParticipants: number) => {
    const drawUrl = `${config.server.frontendUrl}/draws/${drawId}`;
    const winnersHtml = winners.map(w => `<span class="winner-badge">🏆 ${w}</span>`).join(' ');
    
    return baseTemplate(`
      <h1>Tirage terminé ! 🎉</h1>
      <p>Votre tirage au sort "<strong>${drawTitle}</strong>" est terminé avec succès.</p>
      
      <div class="highlight-box" style="text-align: center;">
        <p style="font-size: 14px; margin-bottom: 12px; color: ${COLORS.textLight};">
          ${winners.length} gagnant${winners.length > 1 ? 's' : ''} sur ${totalParticipants} participants
        </p>
        <div>${winnersHtml}</div>
      </div>
      
      <div class="cta-container">
        <a href="${drawUrl}" class="btn btn-success">Voir les résultats complets</a>
      </div>
      
      <ul class="feature-list">
        <li>
          <span class="feature-icon">📜</span>
          <span>Téléchargez le certificat d'authenticité</span>
        </li>
        <li>
          <span class="feature-icon">📤</span>
          <span>Partagez les résultats avec vos participants</span>
        </li>
        <li>
          <span class="feature-icon">📊</span>
          <span>Exportez les données en CSV/PDF</span>
        </li>
      </ul>
      
      <p style="font-size: 14px; color: ${COLORS.textLight};">
        Chaque tirage Cleack est cryptographiquement sécurisé et vérifiable.
      </p>
    `, `Résultats du tirage "${drawTitle}" - ${winners.length} gagnant(s)`);
  },

  drawInvitation: (organizerName: string, drawTitle: string, drawId: string) => {
    const drawUrl = `${config.server.frontendUrl}/draws/${drawId}`;
    
    return baseTemplate(`
      <h1>Vous êtes invité(e) à un tirage ! 🎲</h1>
      <p><strong>${organizerName}</strong> vous invite à participer au tirage au sort :</p>
      
      <div class="highlight-box" style="text-align: center;">
        <p style="font-size: 20px; font-weight: 700; margin: 0; color: ${COLORS.text};">
          "${drawTitle}"
        </p>
      </div>
      
      <div class="cta-container">
        <a href="${drawUrl}" class="btn">Voir le tirage</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: ${COLORS.textLight};">
        Cleack garantit des tirages au sort équitables, transparents et vérifiables grâce à notre technologie cryptographique.
      </p>
    `, `${organizerName} vous invite au tirage "${drawTitle}"`);
  },

  videoReady: (drawTitle: string, downloadUrl: string, expiresIn: string) => baseTemplate(`
    <h1>Votre vidéo est prête ! 🎬</h1>
    <p>La vidéo de votre tirage au sort "<strong>${drawTitle}</strong>" a été générée avec succès.</p>

    <div class="highlight-box" style="text-align: center;">
      <p style="font-size: 14px; margin-bottom: 12px; color: ${COLORS.textLight};">
        🎉 Cliquez sur le bouton ci-dessous pour télécharger votre vidéo
      </p>
    </div>

    <div class="cta-container">
      <a href="${downloadUrl}" class="btn btn-success">Télécharger la vidéo MP4</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 14px; color: ${COLORS.textLight};">
      ⏱️ Ce lien expire dans <strong>${expiresIn}</strong>.<br>
      Téléchargez votre vidéo maintenant pour la conserver.
    </p>

    <ul class="feature-list">
      <li>
        <span class="feature-icon">📱</span>
        <span>Format vertical optimisé pour les réseaux sociaux</span>
      </li>
      <li>
        <span class="feature-icon">📤</span>
        <span>Partagez directement sur Instagram, TikTok, etc.</span>
      </li>
    </ul>
  `, `Votre vidéo "${drawTitle}" est prête à télécharger !`),

  subscriptionConfirmation: (planName: string, amount: string) => baseTemplate(`
    <h1>Abonnement confirmé ! ✨</h1>
    <p>Merci pour votre confiance ! Votre abonnement <strong>${planName}</strong> est maintenant actif.</p>
    
    <div class="highlight-box" style="text-align: center;">
      <p style="font-size: 14px; margin-bottom: 8px; color: ${COLORS.textLight};">Votre abonnement</p>
      <p style="font-size: 28px; font-weight: 700; margin: 0; color: ${COLORS.primary};">${planName}</p>
      <p style="font-size: 18px; margin-top: 8px; color: ${COLORS.text};">${amount}</p>
    </div>
    
    <div class="cta-container">
      <a href="${config.server.frontendUrl}/dashboard" class="btn">Commencer à créer</a>
    </div>
    
    <ul class="feature-list">
      <li>
        <span class="feature-icon">♾️</span>
        <span>Tirages illimités</span>
      </li>
      <li>
        <span class="feature-icon">📜</span>
        <span>Certificats personnalisés</span>
      </li>
      <li>
        <span class="feature-icon">🎨</span>
        <span>Personnalisation avancée</span>
      </li>
      <li>
        <span class="feature-icon">💬</span>
        <span>Support prioritaire</span>
      </li>
    </ul>
  `, `Votre abonnement ${planName} est actif !`),
};

/**
 * Resend Email Service
 */
class ResendEmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    this.resend = new Resend(config.email.resend?.apiKey || '');
    this.fromEmail = config.email.resend?.fromEmail || 'Cleack <noreply@cleack.io>';
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    const name = firstName || 'là';
    
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Bienvenue sur Cleack ! 🎲',
        html: templates.welcome(name),
      });
      logger.info(`Welcome email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send welcome email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Vérifiez votre email - Cleack ✉️',
        html: templates.emailVerification(token),
      });
      logger.info(`Verification email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send verification email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Réinitialisation de mot de passe - Cleack 🔐',
        html: templates.passwordReset(token),
      });
      logger.info(`Password reset email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send password reset email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send draw completion/results email
   */
  async sendDrawCompletionEmail(
    email: string,
    drawTitle: string,
    drawId: string,
    winners: string[] = [],
    totalParticipants: number = 0,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Tirage terminé : ${drawTitle} 🎉`,
        html: templates.drawResults(drawTitle, drawId, winners, totalParticipants),
      });
      logger.info(`Draw completion email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send draw completion email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send draw completion email');
    }
  }

  /**
   * Send draw invitation email
   */
  async sendDrawInvitationEmail(
    email: string,
    organizerName: string,
    drawTitle: string,
    drawId: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `${organizerName} vous invite à un tirage 🎲`,
        html: templates.drawInvitation(organizerName, drawTitle, drawId),
      });
      logger.info(`Draw invitation email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send draw invitation email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send draw invitation email');
    }
  }

  /**
   * Send subscription confirmation email
   */
  async sendSubscriptionConfirmationEmail(
    email: string,
    planName: string,
    amount: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Abonnement ${planName} confirmé ! ✨`,
        html: templates.subscriptionConfirmation(planName, amount),
      });
      logger.info(`Subscription confirmation email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send subscription confirmation email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send subscription confirmation email');
    }
  }

  /**
   * Send video ready email
   */
  async sendVideoReadyEmail(
    email: string,
    drawTitle: string,
    downloadUrl: string,
    expiresIn: string = '7 jours',
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Votre vidéo est prête : ${drawTitle} 🎬`,
        html: templates.videoReady(drawTitle, downloadUrl, expiresIn),
      });
      logger.info(`Video ready email sent to ${email} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send video ready email via Resend', {
        error: error.message,
        email,
      });
      throw new Error('Failed to send video ready email');
    }
  }

  /**
   * Send a custom email
   */
  async sendCustomEmail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html: baseTemplate(htmlContent),
      });
      logger.info(`Custom email sent to ${to} via Resend`);
    } catch (error: any) {
      logger.error('Failed to send custom email via Resend', {
        error: error.message,
        to,
      });
      throw new Error('Failed to send custom email');
    }
  }
}

// Export singleton instance
export const resendEmailService = new ResendEmailService();

// Alias for compatibility with existing imports
export const emailService = resendEmailService;

// Export templates for testing
export { templates, baseTemplate };
