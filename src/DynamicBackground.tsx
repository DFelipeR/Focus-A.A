import React, { useEffect, useRef } from "react";

interface DynamicBackgroundProps {
  theme: string;
}

export default function DynamicBackground({ theme }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 1. MATRIX RAIN
    // ==========================================
    const katakana = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const rainDrops: number[] = Array(columns).fill(1);
    const dropSpeeds: number[] = Array(columns).fill(0).map(() => Math.random() * 0.8 + 0.6);

    // ==========================================
    // 2. SYNTHWAVE 80s
    // ==========================================
    let synthwaveCityPhase = 0;
    let synthwaveGroundPhase = 0;
    const synthwaveBuildings = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      width: Math.random() * 0.025 + 0.012,
      height: Math.random() * 0.18 + 0.05,
      shade: Math.random() > 0.5 ? "#090719" : "#100923",
    }));
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.45),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    // ==========================================
    // 3. AMBER PIP-BOY
    // ==========================================
    let scanlineY = 0;

    // ==========================================
    // 4. CYBERPUNK / NEON (Nodos de datos y chispas flotantes)
    // ==========================================
    const cyberNodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? "#00f0ff" : "#ff007f", // Cian y Fucsia neón
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // ==========================================
    // 5. ACID & OTROS
    // ==========================================
    const acidParticles = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speedY: (Math.random() - 0.5) * 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const upsideDownAsh = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: Math.random() * 0.65 + 0.15,
      alpha: Math.random() * 0.55 + 0.15,
    }));

    const arcadeGhosts = Array.from({ length: 5 }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.35 + 0.15,
      color: ["#ff00ff", "#00ffff", "#ff0033", "#ffd700", "#7c4dff"][index],
    }));
    let arcadeGridOffset = 0;
    let pacmanX = -28;
    let animationTime = 0;
    let previousFrameTime = 0;

    const eclipseStars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.12 + 0.02,
    }));

    const render = (timestamp: number) => {
      const deltaSeconds = previousFrameTime
        ? Math.min((timestamp - previousFrameTime) / 1000, 0.05)
        : 0;
      previousFrameTime = timestamp;
      animationTime += deltaSeconds;
      ctx.clearRect(0, 0, width, height);

      if (theme === "matrix") {
        ctx.fillStyle = "rgba(0, 8, 2, 0.15)";
        ctx.fillRect(0, 0, width, height);
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < rainDrops.length; i++) {
          const char = katakana.charAt(Math.floor(Math.random() * katakana.length));
          ctx.fillStyle = "#ffffff";
          const x = i * fontSize;
          const y = rainDrops[i] * fontSize;
          ctx.fillText(char, x, y);

          ctx.fillStyle = "#00ff41";
          ctx.fillText(katakana.charAt(Math.floor(Math.random() * katakana.length)), x, y - fontSize);

          if (y > height && Math.random() > 0.975) {
            rainDrops[i] = 0;
            dropSpeeds[i] = Math.random() * 0.8 + 0.6;
          }
          rainDrops[i] += dropSpeeds[i];
        }
      } else if (theme === "synthwave") {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#05020c");
        bgGrad.addColorStop(0.58, "#1b0730");
        bgGrad.addColorStop(1, "#090817");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#ffffff";
        stars.forEach((star) => {
          ctx.globalAlpha = star.alpha;
          ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        ctx.globalAlpha = 1.0;

        const horizonY = height * 0.61;
        const sunX = width * 0.5;
        const sunRadius = Math.min(width * 0.16, height * 0.22);
        const sunY = horizonY - sunRadius * 0.56;
        const horizonGlow = ctx.createRadialGradient(
          sunX,
          horizonY,
          0,
          sunX,
          horizonY,
          width * 0.52,
        );
        horizonGlow.addColorStop(0, "rgba(255, 0, 127, 0.24)");
        horizonGlow.addColorStop(0.42, "rgba(255, 64, 130, 0.08)");
        horizonGlow.addColorStop(1, "rgba(255, 0, 127, 0)");
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, horizonY - height * 0.35, width, height * 0.52);

        const sunGlow = ctx.createRadialGradient(
          sunX,
          sunY,
          sunRadius * 0.6,
          sunX,
          sunY,
          sunRadius * 2.2,
        );
        sunGlow.addColorStop(0, "rgba(255, 72, 152, 0.3)");
        sunGlow.addColorStop(1, "rgba(255, 0, 127, 0)");
        ctx.fillStyle = sunGlow;
        ctx.fillRect(
          sunX - sunRadius * 2.2,
          sunY - sunRadius * 2.2,
          sunRadius * 4.4,
          sunRadius * 4.4,
        );

        const sunGrad = ctx.createLinearGradient(
          sunX,
          sunY - sunRadius,
          sunX,
          sunY + sunRadius,
        );
        sunGrad.addColorStop(0, "#ff4f9a");
        sunGrad.addColorStop(0.52, "#ff007f");
        sunGrad.addColorStop(1, "#ff8a24");
        ctx.save();
        ctx.shadowColor = "#ff007f";
        ctx.shadowBlur = 28;
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#1b0730";
        for (let i = 0; i < 8; i++) {
          const sliceY = sunY + sunRadius * 0.2 + i * sunRadius * 0.15;
          const sliceHeight = Math.max(2, sunRadius * (0.035 + i * 0.006));
          ctx.fillRect(
            sunX - sunRadius - 2,
            sliceY,
            sunRadius * 2 + 4,
            sliceHeight,
          );
        }
        ctx.restore();

        const cityPeriod = Math.max(width, 1);
        synthwaveCityPhase =
          (synthwaveCityPhase + deltaSeconds * 52) % cityPeriod;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, horizonY - height * 0.2, width, height * 0.2);
        ctx.clip();
        for (const tileOffset of [-cityPeriod, 0, cityPeriod]) {
          for (const building of synthwaveBuildings) {
            const buildingX =
              building.x * cityPeriod - synthwaveCityPhase + tileOffset;
            const buildingWidth = building.width * cityPeriod;
            const buildingHeight = building.height * height * 0.78;
            ctx.fillStyle = building.shade;
            ctx.fillRect(
              buildingX,
              horizonY - buildingHeight,
              buildingWidth,
              buildingHeight,
            );
            ctx.fillStyle = "rgba(255, 0, 127, 0.48)";
            ctx.fillRect(
              buildingX,
              horizonY - buildingHeight,
              buildingWidth,
              1,
            );

            if (buildingWidth > 22 && buildingHeight > 30) {
              ctx.fillStyle = "rgba(0, 240, 255, 0.32)";
              const windowSize = Math.max(2, buildingWidth * 0.07);
              for (
                let windowY = horizonY - buildingHeight + 9;
                windowY < horizonY - 5;
                windowY += 12
              ) {
                for (
                  let windowX = buildingX + 6;
                  windowX < buildingX + buildingWidth - 4;
                  windowX += 12
                ) {
                  ctx.fillRect(windowX, windowY, windowSize, 3);
                }
              }
            }
          }
        }
        ctx.restore();

        const groundHeight = height - horizonY;
        const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
        groundGrad.addColorStop(0, "#10091f");
        groundGrad.addColorStop(0.16, "#090817");
        groundGrad.addColorStop(1, "#03040a");
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, horizonY, width, groundHeight);

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, horizonY, width, groundHeight);
        ctx.clip();
        synthwaveGroundPhase = (synthwaveGroundPhase + deltaSeconds * 0.42) % 1;
        const vanishingX = width * 0.5;
        ctx.lineWidth = 1;
        for (let line = -12; line <= 12; line++) {
          const bottomX = vanishingX + (width * line) / 12;
          ctx.strokeStyle = line % 3 === 0
            ? "rgba(255, 0, 127, 0.38)"
            : "rgba(0, 240, 255, 0.24)";
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizonY);
          ctx.lineTo(bottomX, height);
          ctx.stroke();
        }

        const horizontalLineCount = 14;
        for (let line = 0; line < horizontalLineCount; line++) {
          const depth = (line + synthwaveGroundPhase) / horizontalLineCount;
          const y = horizonY + depth * depth * groundHeight;
          const halfWidth = width * (0.035 + depth * 0.72);
          ctx.strokeStyle = line % 3 === 0
            ? "rgba(255, 0, 127, 0.48)"
            : "rgba(0, 240, 255, 0.32)";
          ctx.beginPath();
          ctx.moveTo(vanishingX - halfWidth, y);
          ctx.lineTo(vanishingX + halfWidth, y);
          ctx.stroke();
        }
        ctx.restore();

        const horizonLine = ctx.createLinearGradient(0, 0, width, 0);
        horizonLine.addColorStop(0, "rgba(0, 240, 255, 0)");
        horizonLine.addColorStop(0.3, "rgba(0, 240, 255, 0.65)");
        horizonLine.addColorStop(0.5, "rgba(255, 0, 127, 0.85)");
        horizonLine.addColorStop(0.7, "rgba(0, 240, 255, 0.65)");
        horizonLine.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.strokeStyle = horizonLine;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ff007f";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(width, horizonY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (theme === "amber") {
        ctx.fillStyle = "#080500";
        ctx.fillRect(0, 0, width, height);

        scanlineY = (scanlineY + 2) % height;
        ctx.fillStyle = "rgba(255, 176, 0, 0.06)";
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.5);
        }

        const crtVignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, width * 0.85);
        crtVignette.addColorStop(0, "transparent");
        crtVignette.addColorStop(0.7, "rgba(10, 6, 0, 0.5)");
        crtVignette.addColorStop(1, "rgba(0, 0, 0, 0.9)");
        ctx.fillStyle = crtVignette;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === "neon") {
        // Fondo Cyberpunk con gradiente profundo y nodos de datos flotantes en red
        const neonBg = ctx.createLinearGradient(0, 0, width, height);
        neonBg.addColorStop(0, "#05070f");
        neonBg.addColorStop(0.5, "#0b0d19");
        neonBg.addColorStop(1, "#030408");
        ctx.fillStyle = neonBg;
        ctx.fillRect(0, 0, width, height);

        // Dibujar líneas de conexión sutiles entre nodos cercanos (efecto red neuronal / ciberespacio)
        for (let i = 0; i < cyberNodes.length; i++) {
          for (let j = i + 1; j < cyberNodes.length; j++) {
            const dx = cyberNodes[i].x - cyberNodes[j].x;
            const dy = cyberNodes[i].y - cyberNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(cyberNodes[i].x, cyberNodes[i].y);
              ctx.lineTo(cyberNodes[j].x, cyberNodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Renderizar y mover partículas de neón
        cyberNodes.forEach((node) => {
          ctx.fillStyle = node.color;
          ctx.globalAlpha = node.alpha;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 8; // Efecto brillante neón

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();

          node.x += node.speedX;
          node.y += node.speedY;

          if (node.x < 0) node.x = width;
          if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          if (node.y > height) node.y = 0;
        });
        ctx.shadowBlur = 0; // Reset sombra
        ctx.globalAlpha = 1.0;
      } else if (theme === "upside-down") {
        ctx.fillStyle = "#08080c";
        ctx.fillRect(0, 0, width, height);

        const haze = ctx.createRadialGradient(
          width * 0.5,
          height * 0.65,
          0,
          width * 0.5,
          height * 0.65,
          Math.max(width, height) * 0.72,
        );
        haze.addColorStop(0, "rgba(90, 0, 18, 0.18)");
        haze.addColorStop(1, "rgba(8, 8, 12, 0)");
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, width, height);

        upsideDownAsh.forEach((ash) => {
          ctx.globalAlpha = ash.alpha;
          ctx.fillStyle = Math.random() > 0.75 ? "#ff4a55" : "#c7a6a6";
          ctx.shadowColor = "#ff0033";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(ash.x, ash.y, ash.radius, 0, Math.PI * 2);
          ctx.fill();
          ash.x += ash.speedX;
          ash.y += ash.speedY;
          if (ash.y > height) {
            ash.y = -4;
            ash.x = Math.random() * width;
          }
          if (ash.x < 0) ash.x = width;
          if (ash.x > width) ash.x = 0;
        });

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(255, 0, 51, 0.16)";
        ctx.lineWidth = 3;
        for (let tentacle = 0; tentacle < 5; tentacle++) {
          const startX = (width / 6) * (tentacle + 0.5);
          ctx.beginPath();
          ctx.moveTo(startX, height + 10);
          ctx.bezierCurveTo(
            startX + Math.sin(animationTime + tentacle) * 70,
            height * 0.7,
            startX - Math.cos(animationTime * 0.7 + tentacle) * 90,
            height * 0.35,
            startX + Math.sin(animationTime * 0.5 + tentacle) * 45,
            height * 0.08,
          );
          ctx.stroke();
        }

        const lightCount = 18;
        for (let i = 0; i < lightCount; i++) {
          const x = (width / (lightCount - 1)) * i;
          const y = 44 + Math.sin(i * 0.42) * 12;
          const pulse = 0.35 + (Math.sin(animationTime * 2.5 + i) + 1) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillStyle = i % 3 === 0 ? "#ff0033" : "#e6d6a8";
          ctx.shadowColor = i % 3 === 0 ? "#ff0033" : "#ffe7ad";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      } else if (theme === "arcade-pixel") {
        ctx.fillStyle = "#09090e";
        ctx.fillRect(0, 0, width, height);

        arcadeGridOffset = (arcadeGridOffset + 21 * deltaSeconds) % 32;
        ctx.strokeStyle = "rgba(0, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        for (let x = 0; x <= width; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = -32 + arcadeGridOffset; y <= height; y += 32) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        const pelletSpacing = 48;
        ctx.fillStyle = "#ffd700";
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 8;
        const pacmanY = height * 0.52;
        for (let y = 24; y < height; y += pelletSpacing) {
          for (let x = 24; x < width; x += pelletSpacing) {
            if (Math.abs(y - pacmanY) < 14 && x < pacmanX) continue;
            const twinkle = 0.45 + (Math.sin(animationTime * 3 + x + y) + 1) * 0.25;
            ctx.globalAlpha = twinkle;
            ctx.fillRect(x, y, 5, 5);
          }
        }

        for (let x = 24; x < width; x += 34) {
          if (x < pacmanX) continue;
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = "#ffd700";
          ctx.fillRect(x, pacmanY, 5, 5);
        }

        const pacmanRadius = 21;
        const mouthAngle = 0.16 + Math.abs(Math.sin(animationTime * 8)) * 0.42;
        pacmanX += 156 * deltaSeconds;
        if (pacmanX > width + pacmanRadius) pacmanX = -pacmanRadius;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffd700";
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(pacmanX, pacmanY);
        ctx.arc(
          pacmanX,
          pacmanY,
          pacmanRadius,
          mouthAngle,
          Math.PI * 2 - mouthAngle,
        );
        ctx.closePath();
        ctx.fill();

        arcadeGhosts.forEach((ghost) => {
          const x = ghost.x;
          const y = ghost.y;
          const ghostWidth = 28;
          const ghostHeight = 32;
          ctx.globalAlpha = 0.82;
          ctx.fillStyle = ghost.color;
          ctx.shadowColor = ghost.color;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.moveTo(x - ghostWidth / 2, y + ghostHeight / 2);
          ctx.lineTo(x - ghostWidth / 2, y - 2);
          ctx.quadraticCurveTo(
            x - ghostWidth / 2,
            y - ghostHeight / 2,
            x,
            y - ghostHeight / 2,
          );
          ctx.quadraticCurveTo(
            x + ghostWidth / 2,
            y - ghostHeight / 2,
            x + ghostWidth / 2,
            y - 2,
          );
          ctx.lineTo(x + ghostWidth / 2, y + ghostHeight / 2);
          ctx.lineTo(x + ghostWidth / 4, y + ghostHeight / 3);
          ctx.lineTo(x, y + ghostHeight / 2);
          ctx.lineTo(x - ghostWidth / 4, y + ghostHeight / 3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#09090e";
          ctx.fillRect(x - 7, y - 5, 4, 7);
          ctx.fillRect(x + 3, y - 5, 4, 7);
          ghost.x += ghost.speed * 60 * deltaSeconds;
          if (ghost.x > width + ghostWidth) {
            ghost.x = -ghostWidth;
            ghost.y = Math.random() * height;
          }
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      } else if (theme === "solar-eclipse") {
        ctx.fillStyle = "#050508";
        ctx.fillRect(0, 0, width, height);

        eclipseStars.forEach((star) => {
          ctx.globalAlpha =
            star.alpha * (0.65 + Math.sin(animationTime * 2 + star.x) * 0.35);
          ctx.fillStyle = "#ded9ff";
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
          star.x -= star.speed * 60 * deltaSeconds;
          if (star.x < 0) {
            star.x = width;
            star.y = Math.random() * height;
          }
        });

        const centerX = width / 2;
        const centerY = height / 2;
        const eclipseRadius = Math.min(width, height) * 0.17;
        const pulse = 1 + Math.sin(animationTime * 1.4) * 0.035;
        const corona = ctx.createRadialGradient(
          centerX,
          centerY,
          eclipseRadius * 0.88,
          centerX,
          centerY,
          eclipseRadius * 2.8 * pulse,
        );
        corona.addColorStop(0, "rgba(255, 102, 0, 0.72)");
        corona.addColorStop(0.28, "rgba(255, 102, 0, 0.2)");
        corona.addColorStop(1, "rgba(75, 0, 130, 0)");
        ctx.globalAlpha = 0.75 + Math.sin(animationTime * 1.4) * 0.15;
        ctx.fillStyle = corona;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(animationTime * 0.08);
        ctx.strokeStyle = "rgba(255, 130, 42, 0.45)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ff6600";
        ctx.shadowBlur = 18;
        for (let flare = 0; flare < 24; flare++) {
          const angle = (Math.PI * 2 * flare) / 24;
          const length = eclipseRadius * (0.18 + (flare % 4) * 0.08);
          const innerRadius = eclipseRadius * 1.08;
          ctx.beginPath();
          ctx.moveTo(
            Math.cos(angle) * innerRadius,
            Math.sin(angle) * innerRadius,
          );
          ctx.lineTo(
            Math.cos(angle) * (innerRadius + length),
            Math.sin(angle) * (innerRadius + length),
          );
          ctx.stroke();
        }
        ctx.restore();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#020204";
        ctx.beginPath();
        ctx.arc(centerX, centerY, eclipseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 128, 28, 0.9)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ff6600";
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(centerX, centerY, eclipseRadius * 1.02, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (theme === "acid") {
        ctx.fillStyle = "#080a05";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ccff00";
        acidParticles.forEach((p) => {
          ctx.globalAlpha = p.alpha;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
          p.x += p.speedX; p.y += p.speedY;
          if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        });
        ctx.globalAlpha = 1.0;
      } else {
        ctx.fillStyle = "#08090c";
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      {theme === "upside-down" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "fixed",
            width: "min(90vw, 1050px)",
            height: "88vh",
            left: "50%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: -1,
            opacity: 0.28,
            filter: "drop-shadow(0 0 30px rgba(100, 0, 12, 0.5))",
          }}
        >
          <defs>
            <radialGradient id="shadow-creature" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#21040a" />
              <stop offset="70%" stopColor="#100308" />
              <stop offset="100%" stopColor="#08080c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g
            fill="none"
            stroke="#21040a"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M450 215 C420 275 365 300 315 370 C280 420 250 490 170 545 M390 285 C350 330 325 395 300 470 C285 515 255 555 220 585 M350 325 C295 340 240 370 195 430 C160 475 125 500 75 510 M510 215 C540 275 595 300 645 370 C680 420 710 490 790 545 M570 285 C610 330 635 395 660 470 C675 515 705 555 740 585 M610 325 C665 340 720 370 765 430 C800 475 835 500 885 510"
              strokeWidth="30"
              opacity=".8"
            />
            <path
              d="M450 105 C380 115 340 175 355 235 C370 290 405 320 450 340 C495 320 530 290 545 235 C560 175 520 115 450 105 Z"
              fill="url(#shadow-creature)"
              stroke="#2b050c"
              strokeWidth="12"
            />
            <path
              d="M405 180 C425 150 475 150 495 180 M420 205 L430 195 M480 205 L470 195 M450 205 L450 245"
              stroke="#510711"
              strokeWidth="9"
              opacity=".75"
            />
            <path
              d="M430 290 C410 350 390 390 375 450 M470 290 C490 350 510 390 525 450"
              stroke="#180309"
              strokeWidth="20"
              opacity=".9"
            />
          </g>
        </svg>
      )}
    </>
  );
}