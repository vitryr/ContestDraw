import * as SibApiV3Sdk from "sib-api-v3-sdk";
import config from "../config/config";
import { logger } from "../utils/logger";

/**
 * Email service using Brevo (formerly Sendinblue)
 * Provides transactional email sending via Brevo's API
 */
class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  private fromSender: { name: string; email: string };

  constructor() {
    // Configure Brevo API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = config.email.brevo.apiKey;

    // Initialize API instance
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Configure sender
    this.fromSender = {
      name: config.email.brevo.fromName,
      email: config.email.brevo.fromEmail,
    };
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.server.frontendUrl}/verify-email?token=${token}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = this.fromSender;
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Verify Your Email - Contest Draw";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Thank you for registering with Contest Draw!</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366F1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        <p style="color: #999; font-size: 14px;">This link will expire in 24 hours.</p>
        <p style="color: #999; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info(`Verification email sent to ${email} via Brevo`);
    } catch (error: any) {
      logger.error("Failed to send verification email via Brevo", {
        error: error.message,
        email,
        response: error.response?.text,
      });
      throw new Error("Failed to send verification email");
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${config.server.frontendUrl}/reset-password?token=${token}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = this.fromSender;
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Reset Your Password - Contest Draw";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366F1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 4px;">${resetUrl}</p>
        <p style="color: #999; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #999; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info(`Password reset email sent to ${email} via Brevo`);
    } catch (error: any) {
      logger.error("Failed to send password reset email via Brevo", {
        error: error.message,
        email,
        response: error.response?.text,
      });
      throw new Error("Failed to send password reset email");
    }
  }

  /**
   * Send draw completion notification
   */
  async sendDrawCompletionEmail(
    email: string,
    drawTitle: string,
    drawId: string,
  ): Promise<void> {
    const drawUrl = `${config.server.frontendUrl}/draws/${drawId}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = this.fromSender;
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = `Draw Completed: ${drawTitle}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Your Draw is Complete! 🎉</h2>
        <p>Great news! Your draw "<strong>${drawTitle}</strong>" has been completed successfully.</p>
        <p>View the results and download your certificate:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${drawUrl}" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            View Results
          </a>
        </div>
        <p>You can also share the results with your participants!</p>
      </div>
    `;

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info(`Draw completion email sent to ${email} via Brevo`);
    } catch (error: any) {
      logger.error("Failed to send draw completion email via Brevo", {
        error: error.message,
        email,
        response: error.response?.text,
      });
      throw new Error("Failed to send draw completion email");
    }
  }

  /**
   * Send welcome email after registration
   */
  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    const name = firstName || "there";

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = this.fromSender;
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Welcome to Contest Draw!";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366F1;">Welcome to Contest Draw, ${name}! 👋</h2>
        <p>Thank you for joining our platform. We're excited to help you conduct fair and transparent contest draws.</p>
        <h3 style="color: #333;">Getting Started:</h3>
        <ul style="line-height: 1.8;">
          <li>🔗 Connect your social media accounts</li>
          <li>🎯 Create your first draw</li>
          <li>📥 Import participants from social posts</li>
          <li>🎲 Execute draws with cryptographic security</li>
          <li>📜 Generate certificates and export results</li>
        </ul>
        <p style="color: #666;">If you have any questions, don't hesitate to reach out to our support team.</p>
        <p style="font-weight: bold;">Happy drawing!</p>
        <p style="color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          Contest Draw Team<br>
          Making contest draws transparent and verifiable
        </p>
      </div>
    `;

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info(`Welcome email sent to ${email} via Brevo`);
    } catch (error: any) {
      logger.error("Failed to send welcome email via Brevo", {
        error: error.message,
        email,
        response: error.response?.text,
      });
      throw new Error("Failed to send welcome email");
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
