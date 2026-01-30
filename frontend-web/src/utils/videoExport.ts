interface Winner {
  position: number;
  name: string;
  username: string;
}

interface VideoExportOptions {
  title: string;
  participantCount: number;
  winners: Winner[];
  width?: number;
  height?: number;
  fps?: number;
  primaryColor?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Renders draw animation directly to canvas and exports as video
 * Much faster than DOM capture - renders at ~60fps
 */
export async function exportToVideo({
  title,
  participantCount,
  winners,
  width = 360,
  height = 640,
  fps = 30,
  primaryColor = "#8b5cf6",
  onProgress,
}: VideoExportOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Animation timing (in frames)
      const introFrames = 2 * fps; // 2 seconds
      const spinningFrames = 3 * fps; // 3 seconds
      const revealFramesPerWinner = 1.5 * fps; // 1.5 seconds per winner
      const summaryFrames = 3 * fps; // 3 seconds

      const totalRevealFrames = winners.length * revealFramesPerWinner;
      const totalFrames = introFrames + spinningFrames + totalRevealFrames + summaryFrames;

      // MediaRecorder setup
      const stream = canvas.captureStream(fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        resolve(new Blob(chunks, { type: "video/webm" }));
      };
      mediaRecorder.onerror = () => reject(new Error("Recording failed"));

      mediaRecorder.start();

      let frame = 0;
      const frameInterval = 1000 / fps;

      const renderFrame = () => {
        // Clear canvas
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#0f0f1a");
        gradient.addColorStop(1, "#1a1a2e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Determine phase
        if (frame < introFrames) {
          renderIntro(ctx, width, height, title, participantCount, primaryColor, frame / introFrames);
        } else if (frame < introFrames + spinningFrames) {
          const progress = (frame - introFrames) / spinningFrames;
          renderSpinning(ctx, width, height, winners, primaryColor, progress);
        } else if (frame < introFrames + spinningFrames + totalRevealFrames) {
          const revealFrame = frame - introFrames - spinningFrames;
          const winnerIndex = Math.floor(revealFrame / revealFramesPerWinner);
          const winnerProgress = (revealFrame % revealFramesPerWinner) / revealFramesPerWinner;
          renderReveal(ctx, width, height, winners[winnerIndex], primaryColor, winnerProgress);
        } else {
          const progress = (frame - introFrames - spinningFrames - totalRevealFrames) / summaryFrames;
          renderSummary(ctx, width, height, title, winners, primaryColor, progress);
        }

        frame++;
        if (onProgress) {
          onProgress(Math.round((frame / totalFrames) * 100));
        }

        if (frame < totalFrames) {
          setTimeout(renderFrame, frameInterval);
        } else {
          mediaRecorder.stop();
        }
      };

      renderFrame();
    } catch (error) {
      reject(error);
    }
  });
}

function renderIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  participantCount: number,
  primaryColor: string,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Emoji with scale animation
  const scale = Math.min(1, progress * 2);
  ctx.font = `${50 * scale}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText("🎉", centerX, centerY - 80);

  // Title
  if (progress > 0.2) {
    const alpha = Math.min(1, (progress - 0.2) * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 28px Arial";
    ctx.fillText("CONTEST DRAW", centerX, centerY - 10);
    ctx.globalAlpha = 1;
  }

  // Subtitle
  if (progress > 0.4) {
    const alpha = Math.min(1, (progress - 0.4) * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    wrapText(ctx, title, centerX, centerY + 30, width - 40, 24);
    ctx.globalAlpha = 1;
  }

  // Participant count
  if (progress > 0.6) {
    const alpha = Math.min(1, (progress - 0.6) * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#9ca3af";
    ctx.font = "16px Arial";
    ctx.fillText(`${participantCount} participants`, centerX, centerY + 80);
    ctx.globalAlpha = 1;
  }
}

function renderSpinning(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  winners: Winner[],
  primaryColor: string,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Title
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Selecting Winner...", centerX, centerY - 100);

  // Spinning circle
  const rotation = progress * Math.PI * 8; // 4 full rotations
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 1.7);
  ctx.stroke();

  ctx.restore();

  // Inner circle with random name
  ctx.fillStyle = `${primaryColor}33`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
  ctx.fill();

  // Random name
  const randomWinner = winners[Math.floor(progress * 100) % winners.length];
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px Arial";
  ctx.fillText(randomWinner?.name || "...", centerX, centerY + 5);

  // Sparkle emoji
  ctx.font = "32px Arial";
  ctx.fillText("✨", centerX, centerY + 80);
}

function renderReveal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  winner: Winner,
  primaryColor: string,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Confetti
  const confettiEmojis = ["🎊", "🎉", "✨", "⭐"];
  for (let i = 0; i < 12; i++) {
    const x = (i % 6) * 60 + 30;
    const y = ((progress * height * 1.5) + (i * 50)) % (height + 100) - 50;
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(confettiEmojis[i % 4], x, y);
  }

  // Trophy
  ctx.font = "48px Arial";
  ctx.fillText("🏆", centerX, centerY - 120);

  // Winner number
  const scale = Math.min(1, progress * 3);
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${24 * scale}px Arial`;
  ctx.fillText(`WINNER #${winner.position}`, centerX, centerY - 60);

  // Avatar circle
  if (progress > 0.2) {
    const circleScale = Math.min(1, (progress - 0.2) * 3);
    const radius = 50 * circleScale;

    const grad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    grad.addColorStop(0, primaryColor);
    grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 20, radius, 0, Math.PI * 2);
    ctx.fill();

    // Initial
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${32 * circleScale}px Arial`;
    ctx.fillText(winner.name.charAt(0).toUpperCase(), centerX, centerY + 32);
  }

  // Name
  if (progress > 0.4) {
    const alpha = Math.min(1, (progress - 0.4) * 3);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText(winner.name, centerX, centerY + 100);
    ctx.globalAlpha = 1;
  }

  // Username
  if (progress > 0.5) {
    const alpha = Math.min(1, (progress - 0.5) * 3);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#9ca3af";
    ctx.font = "16px Arial";
    ctx.fillText(`@${winner.username}`, centerX, centerY + 130);
    ctx.globalAlpha = 1;
  }
}

function renderSummary(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  winners: Winner[],
  primaryColor: string,
  progress: number
) {
  const centerX = width / 2;

  // Header
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🎊", centerX, 100);

  ctx.fillStyle = primaryColor;
  ctx.font = "bold 28px Arial";
  ctx.fillText("WINNERS", centerX, 150);

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  wrapText(ctx, title, centerX, 180, width - 40, 18);

  // Winners list
  const startY = 240;
  winners.forEach((winner, index) => {
    const itemProgress = Math.min(1, Math.max(0, progress * winners.length - index));
    if (itemProgress > 0) {
      const y = startY + index * 50;
      const offsetX = (1 - itemProgress) * -30;

      ctx.globalAlpha = itemProgress;

      // Position number
      ctx.fillStyle = index === 0 ? primaryColor : "#ffffff";
      ctx.font = index === 0 ? "bold 20px Arial" : "16px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${winner.position}.`, 40 + offsetX, y);

      // Name
      ctx.font = index === 0 ? "bold 18px Arial" : "16px Arial";
      ctx.fillText(winner.name, 80 + offsetX, y);

      // Username
      ctx.fillStyle = "#6b7280";
      ctx.font = "14px Arial";
      ctx.fillText(`@${winner.username}`, 80 + offsetX, y + 20);

      ctx.globalAlpha = 1;
    }
  });

  // Footer
  ctx.fillStyle = "#4b5563";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Powered by Cleack • Fair & Transparent", centerX, height - 40);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
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
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
