/**
 * Video generation service for draw animations
 * Generates MP4 videos using canvas + ffmpeg
 * Stores in S3 and notifies via email
 */

import sharp from "sharp";
import { createCanvas, CanvasRenderingContext2D } from "canvas";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { spawn } from "child_process";
import { createWriteStream, unlinkSync, existsSync, mkdirSync, readdirSync, rmdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../utils/prisma";
import { resendEmailService } from "./resend-email.service";
import config from "../config/config";
import logger from "../utils/logger";

/**
 * Video configuration options
 */
export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
  duration: number;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  animationSpeed: "slow" | "medium" | "fast";
}

/**
 * Default video configuration
 */
export const defaultVideoConfig: VideoConfig = {
  width: 1080,
  height: 1920, // 9:16 aspect ratio for social media
  fps: 10,
  duration: 8, // seconds
  backgroundColor: "#1a1a2e",
  textColor: "#ffffff",
  primaryColor: "#8b5cf6",
  animationSpeed: "medium",
};

interface DrawData {
  id: string;
  title: string;
  winners: Array<{
    position: number;
    participant: {
      name: string;
      identifier: string;
    };
  }>;
  participants: Array<{
    name: string;
    identifier: string;
  }>;
}

/**
 * Generate SVG frame for the draw animation
 */
function generateSVGFrame(
  draw: DrawData,
  frameType: "intro" | "spinning" | "reveal" | "winner",
  winnerIndex: number = 0,
  config: VideoConfig = defaultVideoConfig,
): string {
  const { width, height, backgroundColor, textColor, primaryColor } = config;

  const winner = draw.winners[winnerIndex];
  const participantList = draw.participants.slice(0, 10);

  let content = "";

  switch (frameType) {
    case "intro":
      content = `
        <text x="${width / 2}" y="${height / 2 - 100}" text-anchor="middle" fill="${primaryColor}" font-size="60" font-weight="bold" font-family="Arial, sans-serif">
          🎉 CONTEST DRAW 🎉
        </text>
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="${textColor}" font-size="40" font-family="Arial, sans-serif">
          ${escapeXml(draw.title)}
        </text>
        <text x="${width / 2}" y="${height / 2 + 80}" text-anchor="middle" fill="${textColor}" font-size="30" font-family="Arial, sans-serif" opacity="0.7">
          ${draw.participants.length} participants
        </text>
      `;
      break;

    case "spinning":
      const randomParticipant =
        participantList[Math.floor(Math.random() * participantList.length)];
      content = `
        <text x="${width / 2}" y="${height / 2 - 200}" text-anchor="middle" fill="${primaryColor}" font-size="40" font-weight="bold" font-family="Arial, sans-serif">
          Selecting Winner...
        </text>
        <circle cx="${width / 2}" cy="${height / 2}" r="150" fill="none" stroke="${primaryColor}" stroke-width="8" stroke-dasharray="50 20"/>
        <text x="${width / 2}" y="${height / 2 + 20}" text-anchor="middle" fill="${textColor}" font-size="36" font-weight="bold" font-family="Arial, sans-serif">
          ${escapeXml(randomParticipant?.name || "...")}
        </text>
      `;
      break;

    case "reveal":
      content = `
        <text x="${width / 2}" y="${height / 2 - 200}" text-anchor="middle" fill="${primaryColor}" font-size="50" font-weight="bold" font-family="Arial, sans-serif">
          🏆 WINNER #${winner?.position || 1} 🏆
        </text>
        <circle cx="${width / 2}" cy="${height / 2}" r="180" fill="${primaryColor}" opacity="0.2"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="150" fill="${primaryColor}" opacity="0.3"/>
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="${textColor}" font-size="48" font-weight="bold" font-family="Arial, sans-serif">
          ${escapeXml(winner?.participant?.name || "Winner")}
        </text>
        <text x="${width / 2}" y="${height / 2 + 60}" text-anchor="middle" fill="${textColor}" font-size="30" font-family="Arial, sans-serif" opacity="0.8">
          @${escapeXml(winner?.participant?.identifier || "username")}
        </text>
      `;
      break;

    case "winner":
      let winnersContent = "";
      draw.winners.forEach((w, i) => {
        const yOffset = 400 + i * 100;
        winnersContent += `
          <text x="${width / 2}" y="${yOffset}" text-anchor="middle" fill="${i === 0 ? primaryColor : textColor}" font-size="${i === 0 ? "40" : "32"}" font-weight="${i === 0 ? "bold" : "normal"}" font-family="Arial, sans-serif">
            ${i + 1}. ${escapeXml(w.participant?.name || "Winner")} (@${escapeXml(w.participant?.identifier || "user")})
          </text>
        `;
      });
      content = `
        <text x="${width / 2}" y="200" text-anchor="middle" fill="${primaryColor}" font-size="60" font-weight="bold" font-family="Arial, sans-serif">
          🎊 WINNERS 🎊
        </text>
        <text x="${width / 2}" y="280" text-anchor="middle" fill="${textColor}" font-size="36" font-family="Arial, sans-serif">
          ${escapeXml(draw.title)}
        </text>
        ${winnersContent}
        <text x="${width / 2}" y="${height - 100}" text-anchor="middle" fill="${textColor}" font-size="24" font-family="Arial, sans-serif" opacity="0.6">
          Powered by Cleack • Fair & Transparent
        </text>
      `;
      break;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  ${content}
</svg>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate animated GIF of draw animation
 */
export const generateDrawVideo = async (
  draw: DrawData,
  config: VideoConfig = defaultVideoConfig,
): Promise<Buffer> => {
  const frames: Buffer[] = [];

  // Generate intro frames (2 seconds = 20 frames at 10fps)
  for (let i = 0; i < 20; i++) {
    const svg = generateSVGFrame(draw, "intro", 0, config);
    const frame = await sharp(Buffer.from(svg)).png().toBuffer();
    frames.push(frame);
  }

  // Generate spinning frames (3 seconds = 30 frames)
  for (let i = 0; i < 30; i++) {
    const svg = generateSVGFrame(draw, "spinning", 0, config);
    const frame = await sharp(Buffer.from(svg)).png().toBuffer();
    frames.push(frame);
  }

  // Generate reveal frames for each winner
  for (let w = 0; w < draw.winners.length; w++) {
    // Reveal animation (1.5 seconds = 15 frames per winner)
    for (let i = 0; i < 15; i++) {
      const svg = generateSVGFrame(draw, "reveal", w, config);
      const frame = await sharp(Buffer.from(svg)).png().toBuffer();
      frames.push(frame);
    }
  }

  // Generate final winners summary (2 seconds = 20 frames)
  for (let i = 0; i < 20; i++) {
    const svg = generateSVGFrame(draw, "winner", 0, config);
    const frame = await sharp(Buffer.from(svg)).png().toBuffer();
    frames.push(frame);
  }

  // Create animated WebP (sharp supports animated WebP, similar to GIF but better quality)
  // For true GIF/MP4 generation, we'd need additional libraries
  // For now, return the first frame as a poster image and include animation data

  // Generate a summary image that can be used as video poster
  const posterSvg = generateSVGFrame(draw, "winner", 0, config);
  const posterBuffer = await sharp(Buffer.from(posterSvg)).png().toBuffer();

  return posterBuffer;
};

/**
 * Generate video data for frontend animation
 * Returns JSON data that the frontend can use to render an animated experience
 */
export const generateVideoData = (draw: DrawData): object => {
  return {
    draw: {
      id: draw.id,
      title: draw.title,
      participantCount: draw.participants.length,
    },
    winners: draw.winners.map((w) => ({
      position: w.position,
      name: w.participant?.name || "Winner",
      username: w.participant?.identifier || "user",
    })),
    animation: {
      phases: [
        { type: "intro", duration: 2000 },
        { type: "spinning", duration: 3000 },
        ...draw.winners.map((_, i) => ({
          type: "reveal",
          winnerIndex: i,
          duration: 1500,
        })),
        { type: "summary", duration: 2000 },
      ],
    },
    config: defaultVideoConfig,
  };
};

/**
 * Generate thumbnail image for a draw
 */
export const generateDrawThumbnail = async (
  draw: DrawData,
  config: VideoConfig = defaultVideoConfig,
): Promise<Buffer> => {
  const svg = generateSVGFrame(draw, "winner", 0, config);
  return sharp(Buffer.from(svg)).png().toBuffer();
};

// ============================================
// Background Video Generation with S3 Storage
// ============================================

interface VideoJobParams {
  drawId: string;
  title: string;
  participantCount: number;
  winners: Array<{ position: number; name: string; username: string }>;
  userEmail: string;
  userId: string;
}

// S3/R2 client configuration
const getS3Client = () => {
  const storageConfig = config.storage.s3;

  if (!storageConfig.accessKeyId || !storageConfig.secretAccessKey) {
    logger.warn("S3/R2 credentials not configured, video upload will fail");
    return null;
  }

  const clientConfig: any = {
    region: storageConfig.region || "auto",
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey,
    },
  };

  // For Cloudflare R2, we need to set the endpoint
  if (storageConfig.endpoint) {
    clientConfig.endpoint = storageConfig.endpoint;
    clientConfig.forcePathStyle = true; // Required for R2
  }

  return new S3Client(clientConfig);
};

const BUCKET_NAME = config.storage.s3?.bucket || "cleack-videos";
const VIDEO_WIDTH = 360;
const VIDEO_HEIGHT = 640;
const FPS = 30;
const PRIMARY_COLOR = "#8b5cf6";

/**
 * Queue a video generation job
 */
export async function queueVideoGeneration(
  params: VideoJobParams
): Promise<{ jobId: string }> {
  const job = await prisma.videoJob.create({
    data: {
      drawId: params.drawId,
      userId: params.userId,
      status: "PENDING",
      metadata: {
        title: params.title,
        participantCount: params.participantCount,
        winners: params.winners,
        userEmail: params.userEmail,
      },
    },
  });

  // Start background processing (non-blocking)
  setImmediate(() => {
    processVideoJob(job.id, params).catch((error) => {
      logger.error("Video generation failed:", error);
    });
  });

  return { jobId: job.id };
}

/**
 * Process video generation job in background
 */
async function processVideoJob(
  jobId: string,
  params: VideoJobParams
): Promise<void> {
  const tempDir = join(process.cwd(), "temp");
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  const framesDir = join(tempDir, `frames-${jobId}`);
  if (!existsSync(framesDir)) {
    mkdirSync(framesDir, { recursive: true });
  }

  const outputPath = join(tempDir, `video-${jobId}.mp4`);

  try {
    await prisma.videoJob.update({
      where: { id: jobId },
      data: { status: "PROCESSING" },
    });

    logger.info(`Starting video generation for job ${jobId}`);

    // Generate frames using canvas
    await generateVideoFrames(framesDir, params);

    // Encode to MP4 using ffmpeg
    await encodeToMp4(framesDir, outputPath);

    // Upload to storage (S3/R2 or local)
    const s3Key = `videos/${params.drawId}/${jobId}.mp4`;
    let downloadUrl: string;

    if (config.storage.type === "local" || !config.storage.s3?.accessKeyId) {
      // Local storage fallback
      downloadUrl = await saveToLocalStorage(outputPath, s3Key);
    } else {
      // S3/R2 storage
      await uploadToS3(outputPath, s3Key);
      downloadUrl = await getSignedDownloadUrl(s3Key);
    }

    // Update job with success
    await prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        videoUrl: downloadUrl,
        s3Key,
        completedAt: new Date(),
      },
    });

    // Send email notification
    await resendEmailService.sendVideoReadyEmail(
      params.userEmail,
      params.title,
      downloadUrl,
      "7 jours"
    );

    logger.info(`Video generation completed for job ${jobId}`);
  } catch (error) {
    logger.error(`Video generation failed for job ${jobId}:`, error);

    await prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
  } finally {
    cleanup(framesDir, outputPath);
  }
}

/**
 * Generate animation frames as PNG images using canvas
 */
async function generateVideoFrames(
  framesDir: string,
  params: VideoJobParams
): Promise<void> {
  const { title, participantCount, winners } = params;

  const introFrames = 2 * FPS;
  const spinningFrames = 3 * FPS;
  const revealFramesPerWinner = Math.floor(1.5 * FPS);
  const summaryFrames = 3 * FPS;

  const totalRevealFrames = winners.length * revealFramesPerWinner;
  const totalFrames = introFrames + spinningFrames + totalRevealFrames + summaryFrames;

  const canvas = createCanvas(VIDEO_WIDTH, VIDEO_HEIGHT);
  const ctx = canvas.getContext("2d");

  for (let frame = 0; frame < totalFrames; frame++) {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, VIDEO_HEIGHT);
    gradient.addColorStop(0, "#0f0f1a");
    gradient.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    if (frame < introFrames) {
      renderIntroFrame(ctx, title, participantCount, frame / introFrames);
    } else if (frame < introFrames + spinningFrames) {
      const progress = (frame - introFrames) / spinningFrames;
      renderSpinningFrame(ctx, winners, progress);
    } else if (frame < introFrames + spinningFrames + totalRevealFrames) {
      const revealFrame = frame - introFrames - spinningFrames;
      const winnerIndex = Math.floor(revealFrame / revealFramesPerWinner);
      const winnerProgress = (revealFrame % revealFramesPerWinner) / revealFramesPerWinner;
      renderRevealFrame(ctx, winners[winnerIndex], winnerProgress);
    } else {
      const progress = (frame - introFrames - spinningFrames - totalRevealFrames) / summaryFrames;
      renderSummaryFrame(ctx, title, winners, progress);
    }

    // Save frame
    const frameNum = String(frame).padStart(5, "0");
    const framePath = join(framesDir, `frame-${frameNum}.png`);
    const buffer = canvas.toBuffer("image/png");
    writeFileSync(framePath, buffer);

    if (frame % 30 === 0) {
      logger.debug(`Generated frame ${frame}/${totalFrames}`);
    }
  }
}

function renderIntroFrame(
  ctx: CanvasRenderingContext2D,
  title: string,
  participantCount: number,
  progress: number
): void {
  const centerX = VIDEO_WIDTH / 2;
  const centerY = VIDEO_HEIGHT / 2;

  const scale = Math.min(1, progress * 2);
  ctx.font = `${50 * scale}px Arial`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("🎉", centerX, centerY - 80);

  if (progress > 0.2) {
    ctx.globalAlpha = Math.min(1, (progress - 0.2) * 2);
    ctx.fillStyle = PRIMARY_COLOR;
    ctx.font = "bold 28px Arial";
    ctx.fillText("CONTEST DRAW", centerX, centerY - 10);
    ctx.globalAlpha = 1;
  }

  if (progress > 0.4) {
    ctx.globalAlpha = Math.min(1, (progress - 0.4) * 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    wrapTextCanvas(ctx, title, centerX, centerY + 30, VIDEO_WIDTH - 40, 24);
    ctx.globalAlpha = 1;
  }

  if (progress > 0.6) {
    ctx.globalAlpha = Math.min(1, (progress - 0.6) * 2);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "16px Arial";
    ctx.fillText(`${participantCount} participants`, centerX, centerY + 80);
    ctx.globalAlpha = 1;
  }
}

function renderSpinningFrame(
  ctx: CanvasRenderingContext2D,
  winners: Array<{ position: number; name: string; username: string }>,
  progress: number
): void {
  const centerX = VIDEO_WIDTH / 2;
  const centerY = VIDEO_HEIGHT / 2;

  ctx.fillStyle = PRIMARY_COLOR;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Selecting Winner...", centerX, centerY - 100);

  const rotation = progress * Math.PI * 8;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  ctx.strokeStyle = PRIMARY_COLOR;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 1.7);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = `${PRIMARY_COLOR}33`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
  ctx.fill();

  const randomWinner = winners[Math.floor(progress * 100) % winners.length];
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px Arial";
  ctx.fillText(randomWinner?.name || "...", centerX, centerY + 5);

  ctx.font = "32px Arial";
  ctx.fillText("✨", centerX, centerY + 80);
}

function renderRevealFrame(
  ctx: CanvasRenderingContext2D,
  winner: { position: number; name: string; username: string },
  progress: number
): void {
  const centerX = VIDEO_WIDTH / 2;
  const centerY = VIDEO_HEIGHT / 2;

  const confettiEmojis = ["🎊", "🎉", "✨", "⭐"];
  for (let i = 0; i < 12; i++) {
    const x = (i % 6) * 60 + 30;
    const y = ((progress * VIDEO_HEIGHT * 1.5 + i * 50) % (VIDEO_HEIGHT + 100)) - 50;
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(confettiEmojis[i % 4], x, y);
  }

  ctx.font = "48px Arial";
  ctx.fillText("🏆", centerX, centerY - 120);

  const scale = Math.min(1, progress * 3);
  ctx.fillStyle = PRIMARY_COLOR;
  ctx.font = `bold ${24 * scale}px Arial`;
  ctx.fillText(`WINNER #${winner.position}`, centerX, centerY - 60);

  if (progress > 0.2) {
    const circleScale = Math.min(1, (progress - 0.2) * 3);
    const radius = 50 * circleScale;

    const grad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    grad.addColorStop(0, PRIMARY_COLOR);
    grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 20, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${32 * circleScale}px Arial`;
    ctx.fillText(winner.name.charAt(0).toUpperCase(), centerX, centerY + 32);
  }

  if (progress > 0.4) {
    ctx.globalAlpha = Math.min(1, (progress - 0.4) * 3);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText(winner.name, centerX, centerY + 100);
    ctx.globalAlpha = 1;
  }

  if (progress > 0.5) {
    ctx.globalAlpha = Math.min(1, (progress - 0.5) * 3);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "16px Arial";
    ctx.fillText(`@${winner.username}`, centerX, centerY + 130);
    ctx.globalAlpha = 1;
  }
}

function renderSummaryFrame(
  ctx: CanvasRenderingContext2D,
  title: string,
  winners: Array<{ position: number; name: string; username: string }>,
  progress: number
): void {
  const centerX = VIDEO_WIDTH / 2;

  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🎊", centerX, 100);

  ctx.fillStyle = PRIMARY_COLOR;
  ctx.font = "bold 28px Arial";
  ctx.fillText("WINNERS", centerX, 150);

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  wrapTextCanvas(ctx, title, centerX, 180, VIDEO_WIDTH - 40, 18);

  const startY = 240;
  winners.forEach((winner, index) => {
    const itemProgress = Math.min(1, Math.max(0, progress * winners.length - index));
    if (itemProgress > 0) {
      const y = startY + index * 50;
      const offsetX = (1 - itemProgress) * -30;

      ctx.globalAlpha = itemProgress;

      ctx.fillStyle = index === 0 ? PRIMARY_COLOR : "#ffffff";
      ctx.font = index === 0 ? "bold 20px Arial" : "16px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${winner.position}.`, 40 + offsetX, y);

      ctx.font = index === 0 ? "bold 18px Arial" : "16px Arial";
      ctx.fillText(winner.name, 80 + offsetX, y);

      ctx.fillStyle = "#6b7280";
      ctx.font = "14px Arial";
      ctx.fillText(`@${winner.username}`, 80 + offsetX, y + 20);

      ctx.globalAlpha = 1;
    }
  });

  ctx.fillStyle = "#4b5563";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Powered by Cleack • Fair & Transparent", centerX, VIDEO_HEIGHT - 40);
}

function wrapTextCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line, x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

/**
 * Encode frames to MP4 using ffmpeg
 */
async function encodeToMp4(framesDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-framerate", String(FPS),
      "-i", join(framesDir, "frame-%05d.png"),
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "23",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      logger.debug(`ffmpeg: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", reject);
  });
}

/**
 * Upload video to S3/R2
 */
async function uploadToS3(filePath: string, s3Key: string): Promise<string> {
  const s3Client = getS3Client();

  if (!s3Client) {
    throw new Error("S3/R2 storage not configured");
  }

  const fileBuffer = readFileSync(filePath);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: "video/mp4",
    })
  );

  logger.info(`Uploaded video to S3/R2: ${s3Key}`);

  // Return the public URL if configured (for R2 with custom domain)
  if (config.storage.s3?.publicUrl) {
    return `${config.storage.s3.publicUrl}/${s3Key}`;
  }

  return s3Key;
}

/**
 * Get signed download URL
 */
async function getSignedDownloadUrl(s3Key: string): Promise<string> {
  // If public URL is configured (R2 with custom domain), return direct URL
  if (config.storage.s3?.publicUrl) {
    return `${config.storage.s3.publicUrl}/${s3Key}`;
  }

  const s3Client = getS3Client();

  if (!s3Client) {
    throw new Error("S3/R2 storage not configured");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Cleanup temp files
 */
function cleanup(framesDir: string, outputPath: string): void {
  try {
    if (existsSync(framesDir)) {
      const files = readdirSync(framesDir);
      for (const file of files) {
        unlinkSync(join(framesDir, file));
      }
      rmdirSync(framesDir);
    }

    if (existsSync(outputPath)) {
      unlinkSync(outputPath);
    }
  } catch (error) {
    logger.warn("Cleanup error:", error);
  }
}

/**
 * Save video to local storage (fallback when S3 not configured)
 */
async function saveToLocalStorage(filePath: string, relativePath: string): Promise<string> {
  const uploadsDir = join(process.cwd(), config.storage.path || "uploads", "videos");

  // Ensure directory exists
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Create subdirectory based on relativePath (e.g., videos/drawId/jobId.mp4)
  const fullPath = join(process.cwd(), config.storage.path || "uploads", relativePath);
  const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Copy file to storage location
  const fileBuffer = readFileSync(filePath);
  writeFileSync(fullPath, fileBuffer);

  logger.info(`Saved video to local storage: ${fullPath}`);

  // Return public URL path
  const apiUrl = config.server.apiUrl || "http://localhost:3000";
  return `${apiUrl}/api/videos/download/${relativePath}`;
}

/**
 * Get video job status
 */
export async function getVideoJobStatus(jobId: string) {
  return prisma.videoJob.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      status: true,
      videoUrl: true,
      error: true,
      createdAt: true,
      completedAt: true,
    },
  });
}
