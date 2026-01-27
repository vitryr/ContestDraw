import * as crypto from "crypto";

/**
 * Shareable links service for draw verification
 * Generates short URLs, QR codes, and embed codes
 */

export interface ShareableLink {
  shortCode: string;
  fullUrl: string;
  qrCodeUrl: string;
  drawId: string;
  expiresAt?: Date;
}

export interface EmbedConfig {
  drawId: string;
  width?: number;
  height?: number;
  theme?: "light" | "dark";
  showParticipants?: boolean;
}

// In-memory store for short codes (in production, use Redis or database)
const shortCodeStore = new Map<
  string,
  { drawId: string; createdAt: Date; expiresAt?: Date }
>();

/**
 * Generate short verification code for URLs
 * @param drawId - Draw ID
 * @returns Short code (8 characters)
 */
export function generateShortCode(drawId: string): string {
  // Generate deterministic short code based on draw ID
  const hash = crypto.createHash("sha256").update(drawId).digest("hex");

  return hash.substring(0, 8);
}

/**
 * Create shareable verification link
 * @param drawId - Draw ID
 * @param baseUrl - Base URL for the application
 * @param expiresInDays - Optional expiration in days
 * @returns Shareable link object
 */
export async function createShareableLink(
  drawId: string,
  baseUrl: string,
  expiresInDays?: number,
): Promise<ShareableLink> {
  const shortCode = generateShortCode(drawId);
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  // Store mapping
  shortCodeStore.set(shortCode, {
    drawId,
    createdAt: new Date(),
    expiresAt,
  });

  const fullUrl = `${baseUrl}/verify/${drawId}`;
  const shortUrl = `${baseUrl}/v/${shortCode}`;
  const qrCodeUrl = `${baseUrl}/api/public/qr/${shortCode}`;

  return {
    shortCode,
    fullUrl: shortUrl,
    qrCodeUrl,
    drawId,
    expiresAt,
  };
}

/**
 * Resolve short code to draw ID
 * @param shortCode - Short code
 * @returns Draw ID or null if not found/expired
 */
export function resolveShortCode(shortCode: string): string | null {
  const entry = shortCodeStore.get(shortCode);

  if (!entry) {
    return null;
  }

  // Check expiration
  if (entry.expiresAt && entry.expiresAt < new Date()) {
    shortCodeStore.delete(shortCode);
    return null;
  }

  return entry.drawId;
}

/**
 * Generate QR code data URL
 * @param url - URL to encode
 * @returns QR code as SVG string
 */
export function generateQRCode(url: string): string {
  // Simple QR code generation using data URL
  // In production, use a library like 'qrcode' or 'qr-image'

  // For now, return a placeholder SVG that represents a QR code
  const size = 200;
  const padding = 20;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="white"/>
      <text x="${size / 2}" y="${size / 2}" text-anchor="middle" font-size="12" fill="black">
        QR Code for: ${url.substring(0, 30)}...
      </text>
      <text x="${size / 2}" y="${size / 2 + 20}" text-anchor="middle" font-size="10" fill="gray">
        (Use QR library in production)
      </text>
    </svg>
  `.trim();
}

/**
 * Generate embed code for verification widget
 * @param config - Embed configuration
 * @param baseUrl - Base URL for the application
 * @returns HTML embed code
 */
export function generateEmbedCode(
  config: EmbedConfig,
  baseUrl: string,
): string {
  const {
    drawId,
    width = 600,
    height = 400,
    theme = "light",
    showParticipants = false,
  } = config;

  const embedUrl = `${baseUrl}/embed/${drawId}?theme=${theme}&participants=${showParticipants}`;

  return `
<!-- Cleack Verification Widget -->
<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  style="border: 1px solid #e2e8f0; border-radius: 8px;"
  title="Cleack Verification"
  allow="clipboard-read; clipboard-write"
></iframe>
  `.trim();
}

/**
 * Generate social media share URLs
 * @param drawId - Draw ID
 * @param title - Draw title
 * @param baseUrl - Base URL
 * @returns Social media share URLs
 */
export function generateSocialShareUrls(
  drawId: string,
  title: string,
  baseUrl: string,
): {
  twitter: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
} {
  const verifyUrl = `${baseUrl}/verify/${drawId}`;
  const text = `Check out the verified results of "${title}" - transparent and fair!`;
  const encodedUrl = encodeURIComponent(verifyUrl);
  const encodedText = encodeURIComponent(text);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };
}

/**
 * Clean up expired short codes (run periodically)
 */
export function cleanupExpiredCodes(): void {
  const now = new Date();
  const toDelete: string[] = [];

  for (const [code, entry] of shortCodeStore.entries()) {
    if (entry.expiresAt && entry.expiresAt < now) {
      toDelete.push(code);
    }
  }

  toDelete.forEach((code) => shortCodeStore.delete(code));
}
