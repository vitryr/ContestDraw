/**
 * Certificate Service
 * Generates PDF certificates with cryptographic hashing for draw verification
 */

import PDFDocument from "pdfkit";
import crypto from "crypto";
import { DrawResult, CertificateData } from "../types/draw.types";

export class CertificateService {
  /**
   * Generate certificate PDF with cryptographic hash
   */
  async generateCertificate(
    drawResult: DrawResult,
  ): Promise<{ buffer: Buffer; hash: string }> {
    const certificateData: CertificateData = {
      drawId: drawResult.drawId,
      timestamp: drawResult.timestamp,
      totalParticipants: drawResult.totalParticipants,
      eligibleParticipants: drawResult.eligibleParticipants,
      winnersCount: drawResult.winners.length,
      alternatesCount: drawResult.alternates.length,
      algorithm: drawResult.algorithm,
      filters: drawResult.filters,
      winners: drawResult.winners,
      alternates: drawResult.alternates,
    };

    // Generate hash first (before PDF to ensure consistency)
    const hash = this.generateHash(certificateData);

    // Generate PDF
    const buffer = await this.generatePDF(certificateData, hash);

    return { buffer, hash };
  }

  /**
   * Generate SHA-256 hash of certificate data
   */
  private generateHash(data: CertificateData): string {
    // Create deterministic string representation
    const hashInput = JSON.stringify({
      drawId: data.drawId,
      timestamp: data.timestamp.toISOString(),
      totalParticipants: data.totalParticipants,
      eligibleParticipants: data.eligibleParticipants,
      winnersCount: data.winnersCount,
      alternatesCount: data.alternatesCount,
      algorithm: data.algorithm,
      filters: data.filters,
      winners: data.winners.map((w) => ({
        username: w.participant.username,
        position: w.position,
        seed: w.seed,
      })),
      alternates: data.alternates.map((a) => ({
        username: a.participant.username,
        position: a.position,
        seed: a.seed,
      })),
    });

    return crypto.createHash("sha256").update(hashInput).digest("hex");
  }

  /**
   * Generate PDF document
   */
  private async generatePDF(
    data: CertificateData,
    hash: string,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Draw Certificate", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Draw ID: ${data.drawId}`, { align: "center" })
        .text(`Date: ${data.timestamp.toLocaleString()}`, { align: "center" })
        .moveDown(1.5);

      // Draw Statistics
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Draw Statistics", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Total Participants: ${data.totalParticipants}`)
        .text(`Eligible Participants: ${data.eligibleParticipants}`)
        .text(`Winners Selected: ${data.winnersCount}`)
        .text(`Alternates Selected: ${data.alternatesCount}`)
        .text(`Algorithm: ${data.algorithm}`)
        .moveDown(1.5);

      // Filters Applied
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Filters Applied", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `Remove Duplicates: ${data.filters.removeDuplicates ? "Yes" : "No"}`,
        )
        .text(
          `Max Entries Per User: ${data.filters.maxEntriesPerUser || "Unlimited"}`,
        )
        .text(`Minimum Mentions: ${data.filters.minMentions}`)
        .text(`Required Hashtag: ${data.filters.requiredHashtag || "None"}`)
        .text(
          `Required Keywords: ${data.filters.requiredKeywords?.join(", ") || "None"}`,
        )
        .text(
          `Verify Following: ${data.filters.verifyFollowing ? "Yes" : "No"}`,
        )
        .text(`Blacklist Count: ${data.filters.blacklist?.length || 0}`)
        .moveDown(1.5);

      // Winners
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Winners", { underline: true })
        .moveDown(0.5);

      doc.fontSize(10).font("Helvetica");
      data.winners.forEach((winner, index) => {
        doc.text(
          `${index + 1}. ${winner.participant.username} (Selected: ${winner.selectedAt.toLocaleString()})`,
          { indent: 20 },
        );
      });

      doc.moveDown(1.5);

      // Alternates
      if (data.alternates.length > 0) {
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("Alternates", { underline: true })
          .moveDown(0.5);

        doc.fontSize(10).font("Helvetica");
        data.alternates.forEach((alternate, index) => {
          doc.text(
            `${index + 1}. ${alternate.participant.username} (Selected: ${alternate.selectedAt.toLocaleString()})`,
            { indent: 20 },
          );
        });

        doc.moveDown(1.5);
      }

      // Cryptographic Hash
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Verification", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(9)
        .font("Courier")
        .text(`SHA-256 Hash:`, { continued: false })
        .fontSize(8)
        .text(hash, {
          width: 500,
          align: "left",
        })
        .moveDown(1);

      // Footer
      doc
        .fontSize(8)
        .font("Helvetica-Oblique")
        .text(
          "This certificate provides cryptographic proof of the draw results. " +
            "The hash can be used to verify the integrity of this document.",
          { align: "center" },
        );

      doc.end();
    });
  }

  /**
   * Verify certificate hash
   */
  verifyCertificate(data: CertificateData, providedHash: string): boolean {
    const calculatedHash = this.generateHash(data);
    return calculatedHash === providedHash;
  }

  /**
   * Generate verification report
   */
  async generateVerificationReport(
    drawId: string,
    certificateHash: string,
  ): Promise<{ valid: boolean; report: string }> {
    // TODO: Fetch draw data from storage
    // For now, return placeholder

    return {
      valid: true,
      report: `Certificate verification for draw ${drawId}:\nHash: ${certificateHash}\nStatus: Valid`,
    };
  }
}

// Singleton instance
const certificateService = new CertificateService();

// Export convenience function
export async function generateCertificatePDF(drawResult: DrawResult): Promise<{ buffer: Buffer; hash: string }> {
  return certificateService.generateCertificate(drawResult);
}

export default certificateService;
