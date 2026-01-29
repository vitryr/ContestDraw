import { Resend } from 'resend';
import config from '../config/config';
import { logger } from '../utils/logger';

/**
 * Modern email templates for Cleack
 * Using Resend API for reliable email delivery
 * 
 * NEW DARK THEME with stars ✨
 */

// Brand colors - NEW DARK THEME
const COLORS = {
  // Background
  bgVoid: '#09090b',
  bgPrimary: '#0f0820',
  bgElevated: '#1a0d2e',
  bgCard: '#2a1f3d',
  bgHover: '#352a4d',
  
  // Text
  inkPrimary: '#ffffff',
  inkSecondary: '#a193b8',
  inkMuted: '#6b5f7d',
  
  // Accents
  accentPrimary: '#ec4899',    // Pink
  accentSecondary: '#7c3aed',  // Purple
  accentTertiary: '#a855f7',   // Light purple
  accentGlow: '#ff2d95',       // Bright pink
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Legacy mappings
  primary: '#7c3aed',
  secondary: '#ec4899',
  text: '#ffffff',
  textLight: '#a193b8',
  background: '#09090b',
  white: '#ffffff',
  border: '#352a4d',
};

/**
 * Generate random stars for the background
 */
function generateStars(count: number = 50): string {
  const stars: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const opacity = Math.random() * 0.5 + 0.3;
    stars.push(`radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${opacity}) 0%, transparent 100%)`);
  }
  return stars.join(', ');
}

/**
 * Base email template wrapper - DARK THEME with stars
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
      background-color: ${COLORS.bgVoid};
      color: ${COLORS.inkPrimary};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    .outer-container {
      background: ${COLORS.bgVoid};
      background-image: ${generateStars(30)};
      min-height: 100%;
      padding: 40px 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .card {
      background: linear-gradient(180deg, ${COLORS.bgElevated} 0%, ${COLORS.bgPrimary} 100%);
      border-radius: 24px;
      border: 1px solid ${COLORS.border};
      overflow: hidden;
      box-shadow: 0 0 60px rgba(124, 58, 237, 0.15), 0 0 120px rgba(236, 72, 153, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, ${COLORS.accentSecondary} 0%, ${COLORS.accentPrimary} 100%);
      padding: 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: ${generateStars(20)};
      opacity: 0.5;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: ${COLORS.white};
      letter-spacing: -0.5px;
      position: relative;
      z-index: 1;
    }
    
    .logo-icon {
      display: inline-block;
      margin-right: 8px;
    }
    
    .content {
      padding: 40px 32px;
      background: ${COLORS.bgCard};
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: ${COLORS.inkPrimary};
      margin-bottom: 16px;
    }
    
    h2 {
      font-size: 18px;
      font-weight: 600;
      color: ${COLORS.inkPrimary};
      margin-bottom: 12px;
    }
    
    p {
      font-size: 16px;
      color: ${COLORS.inkSecondary};
      margin-bottom: 16px;
    }
    
    a {
      color: ${COLORS.accentPrimary};
    }
    
    .btn {
      display: inline-block;
      padding: 16px 36px;
      background: linear-gradient(135deg, ${COLORS.accentPrimary} 0%, ${COLORS.accentSecondary} 100%);
      color: ${COLORS.white} !important;
      text-decoration: none;
      border-radius: 14px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 0 30px rgba(236, 72, 153, 0.4), 0 4px 20px rgba(124, 58, 237, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 40px rgba(236, 72, 153, 0.5), 0 6px 30px rgba(124, 58, 237, 0.4);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, ${COLORS.accentSecondary} 0%, ${COLORS.accentTertiary} 100%);
    }
    
    .btn-success {
      background: linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
    }
    
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, ${COLORS.border} 50%, transparent 100%);
      margin: 24px 0;
    }
    
    .code-box {
      background: ${COLORS.bgPrimary};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      word-break: break-all;
      color: ${COLORS.inkSecondary};
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 24px 0;
    }
    
    .feature-list li {
      display: flex;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid ${COLORS.border};
      color: ${COLORS.inkSecondary};
    }
    
    .feature-list li:last-child {
      border-bottom: none;
    }
    
    .feature-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, ${COLORS.accentSecondary} 0%, ${COLORS.accentPrimary} 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      font-size: 18px;
      box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
    }
    
    .footer {
      padding: 24px 32px;
      background: ${COLORS.bgPrimary};
      text-align: center;
      border-top: 1px solid ${COLORS.border};
    }
    
    .footer p {
      font-size: 14px;
      color: ${COLORS.inkMuted};
      margin-bottom: 8px;
    }
    
    .social-links {
      margin: 16px 0;
    }
    
    .social-links a {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: ${COLORS.bgCard};
      border-radius: 50%;
      margin: 0 6px;
      line-height: 40px;
      text-decoration: none;
      color: ${COLORS.inkSecondary};
      font-size: 16px;
      border: 1px solid ${COLORS.border};
      transition: all 0.2s;
    }
    
    .social-links a:hover {
      background: ${COLORS.bgHover};
      border-color: ${COLORS.accentPrimary};
      color: ${COLORS.accentPrimary};
    }
    
    .highlight-box {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
      border: 1px solid ${COLORS.border};
      position: relative;
      overflow: hidden;
    }
    
    .highlight-box::before {
      content: '✨';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 40px;
      opacity: 0.3;
    }
    
    .winner-badge {
      display: inline-block;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: ${COLORS.bgPrimary};
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 700;
      font-size: 14px;
      margin: 6px 4px;
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
    }
    
    .stars-decoration {
      text-align: center;
      font-size: 24px;
      margin: 20px 0;
      letter-spacing: 8px;
      opacity: 0.6;
    }
    
    .warning-box {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
    }
    
    .warning-box p {
      color: ${COLORS.warning};
      margin: 0;
      font-size: 14px;
    }
    
    @media only screen and (max-width: 600px) {
      .outer-container { padding: 20px 0; }
      .container { padding: 0 12px; }
      .content { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      h1 { font-size: 20px; }
      .btn { padding: 14px 28px; font-size: 14px; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="outer-container">
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
          <p style="font-size: 12px;">✨ Tirages au sort transparents et vérifiables ✨</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Email Templates - DARK THEME
 */
const templates = {
  welcome: (name: string) => baseTemplate(`
    <div class="stars-decoration">✦ ✧ ✦ ✧ ✦</div>
    <h1>Bienvenue sur Cleack, ${name} ! 👋</h1>
    <p>Nous sommes ravis de vous accueillir sur notre plateforme de tirages au sort professionnels.</p>
    
    <div class="highlight-box">
      <p style="margin: 0; font-weight: 600; color: ${COLORS.inkPrimary};">
        🎉 Votre compte est prêt ! Commencez dès maintenant à organiser des tirages au sort équitables et transparents.
      </p>
    </div>
    
    <h2 style="margin-top: 32px;">Ce que vous pouvez faire :</h2>
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
      <a href="${config.server.frontendUrl}/dashboard" class="btn">✨ Accéder à mon tableau de bord</a>
    </div>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px;">
      Des questions ? Notre équipe est là pour vous aider à <a href="mailto:support@cleack.io">support@cleack.io</a>
    </p>
  `, `Bienvenue ${name} ! Votre compte Cleack est prêt.`),

  emailVerification: (token: string) => {
    const verificationUrl = `${config.server.frontendUrl}/verify-email?token=${token}`;
    return baseTemplate(`
      <div class="stars-decoration">✦ ✧ ✦</div>
      <h1>Vérifiez votre adresse email ✉️</h1>
      <p>Merci de vous être inscrit sur Cleack ! Pour finaliser votre inscription, veuillez confirmer votre adresse email.</p>
      
      <div class="cta-container">
        <a href="${verificationUrl}" class="btn">✨ Vérifier mon email</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
      <div class="code-box">${verificationUrl}</div>
      
      <div class="warning-box">
        <p>⏱️ Ce lien expire dans <strong>24 heures</strong>.<br>
        Si vous n'avez pas créé de compte, ignorez simplement cet email.</p>
      </div>
    `, 'Confirmez votre email pour activer votre compte Cleack');
  },

  passwordReset: (token: string) => {
    const resetUrl = `${config.server.frontendUrl}/reset-password?token=${token}`;
    return baseTemplate(`
      <div class="stars-decoration">✦ ✧ ✦</div>
      <h1>Réinitialisation de mot de passe 🔐</h1>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau.</p>
      
      <div class="cta-container">
        <a href="${resetUrl}" class="btn btn-secondary">🔑 Réinitialiser mon mot de passe</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
      <div class="code-box">${resetUrl}</div>
      
      <div class="warning-box">
        <p>⚠️ Ce lien expire dans <strong>1 heure</strong>.<br>
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email ou contactez-nous.</p>
      </div>
    `, 'Réinitialisez votre mot de passe Cleack');
  },

  drawResults: (drawTitle: string, drawId: string, winners: string[], totalParticipants: number) => {
    const drawUrl = `${config.server.frontendUrl}/draws/${drawId}`;
    const winnersHtml = winners.map(w => `<span class="winner-badge">🏆 ${w}</span>`).join(' ');
    
    return baseTemplate(`
      <div class="stars-decoration">🌟 ✨ 🎉 ✨ 🌟</div>
      <h1>Tirage terminé ! 🎉</h1>
      <p>Votre tirage au sort "<strong style="color: ${COLORS.inkPrimary};">${drawTitle}</strong>" est terminé avec succès.</p>
      
      <div class="highlight-box" style="text-align: center;">
        <p style="font-size: 14px; margin-bottom: 16px; color: ${COLORS.inkSecondary};">
          ${winners.length} gagnant${winners.length > 1 ? 's' : ''} sur ${totalParticipants} participants
        </p>
        <div>${winnersHtml}</div>
      </div>
      
      <div class="cta-container">
        <a href="${drawUrl}" class="btn btn-success">🎯 Voir les résultats complets</a>
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
      
      <p style="font-size: 14px; color: ${COLORS.inkMuted};">
        ✨ Chaque tirage Cleack est cryptographiquement sécurisé et vérifiable.
      </p>
    `, `Résultats du tirage "${drawTitle}" - ${winners.length} gagnant(s)`);
  },

  drawInvitation: (organizerName: string, drawTitle: string, drawId: string) => {
    const drawUrl = `${config.server.frontendUrl}/draws/${drawId}`;
    
    return baseTemplate(`
      <div class="stars-decoration">✦ ✧ ✦ ✧ ✦</div>
      <h1>Vous êtes invité(e) à un tirage ! 🎲</h1>
      <p><strong style="color: ${COLORS.inkPrimary};">${organizerName}</strong> vous invite à participer au tirage au sort :</p>
      
      <div class="highlight-box" style="text-align: center;">
        <p style="font-size: 22px; font-weight: 700; margin: 0; color: ${COLORS.inkPrimary};">
          "${drawTitle}"
        </p>
      </div>
      
      <div class="cta-container">
        <a href="${drawUrl}" class="btn">✨ Voir le tirage</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: ${COLORS.inkMuted};">
        Cleack garantit des tirages au sort équitables, transparents et vérifiables grâce à notre technologie cryptographique.
      </p>
    `, `${organizerName} vous invite au tirage "${drawTitle}"`);
  },

  videoReady: (drawTitle: string, downloadUrl: string, expiresIn: string) => baseTemplate(`
    <div class="stars-decoration">🎬 ✨ 🎬</div>
    <h1>Votre vidéo est prête ! 🎬</h1>
    <p>La vidéo de votre tirage au sort "<strong style="color: ${COLORS.inkPrimary};">${drawTitle}</strong>" a été générée avec succès.</p>

    <div class="highlight-box" style="text-align: center;">
      <p style="font-size: 16px; margin: 0; color: ${COLORS.inkSecondary};">
        🎉 Cliquez sur le bouton ci-dessous pour télécharger votre vidéo
      </p>
    </div>

    <div class="cta-container">
      <a href="${downloadUrl}" class="btn btn-success">⬇️ Télécharger la vidéo MP4</a>
    </div>

    <div class="divider"></div>

    <div class="warning-box">
      <p>⏱️ Ce lien expire dans <strong>${expiresIn}</strong>.<br>
      Téléchargez votre vidéo maintenant pour la conserver.</p>
    </div>

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
    <div class="stars-decoration">✨ 🌟 ✨</div>
    <h1>Abonnement confirmé ! ✨</h1>
    <p>Merci pour votre confiance ! Votre abonnement <strong style="color: ${COLORS.inkPrimary};">${planName}</strong> est maintenant actif.</p>
    
    <div class="highlight-box" style="text-align: center;">
      <p style="font-size: 14px; margin-bottom: 8px; color: ${COLORS.inkMuted};">Votre abonnement</p>
      <p style="font-size: 32px; font-weight: 700; margin: 8px 0; background: linear-gradient(135deg, ${COLORS.accentPrimary} 0%, ${COLORS.accentSecondary} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${planName}</p>
      <p style="font-size: 20px; margin-top: 8px; color: ${COLORS.inkPrimary};">${amount}</p>
    </div>
    
    <div class="cta-container">
      <a href="${config.server.frontendUrl}/dashboard" class="btn">🚀 Commencer à créer</a>
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
        subject: '✨ Bienvenue sur Cleack ! 🎲',
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
        subject: '✉️ Vérifiez votre email - Cleack',
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
        subject: '🔐 Réinitialisation de mot de passe - Cleack',
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
        subject: `🎉 Tirage terminé : ${drawTitle}`,
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
        subject: `🎲 ${organizerName} vous invite à un tirage`,
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
        subject: `✨ Abonnement ${planName} confirmé !`,
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
        subject: `🎬 Votre vidéo est prête : ${drawTitle}`,
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
