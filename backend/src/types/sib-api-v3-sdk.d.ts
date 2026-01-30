/**
 * Type declarations for sib-api-v3-sdk (Resend Node.js SDK)
 * The package doesn't include TypeScript definitions
 */
declare module "sib-api-v3-sdk" {
  export class ApiClient {
    static instance: ApiClient;
    authentications: {
      "api-key": {
        apiKey: string;
      };
    };
  }

  export class TransactionalEmailsApi {
    sendTransacEmail(sendSmtpEmail: SendSmtpEmail): Promise<any>;
  }

  export class SendSmtpEmail {
    sender?: { name: string; email: string };
    to?: Array<{ email: string; name?: string }>;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    params?: Record<string, any>;
    tags?: string[];
  }
}
