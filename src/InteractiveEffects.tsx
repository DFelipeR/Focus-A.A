import React, { useEffect, useState } from "react";

interface EffectParticle {
  id: number;
  x: number;
  y: number;
  text?: string;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  scale: number;
  shape: "matrix-char" | "synthwave-sun" | "amber-box" | "neon-spark" | "minimal-dot";
}

interface InteractiveEffectsProps {
  theme: string;
}

export default function InteractiveEffects({ theme }: InteractiveEffectsProps) {
  const [particles, setParticles] = useState<EffectParticle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const newParticles: EffectParticle[] = [];

      let color = "#00f0ff";
      let count = 8;
      let shape: EffectParticle["shape"] = "neon-spark";
      let texts = [""];
      let initialAlpha = 0.9;

      if (theme === "matrix") {
        color = "#00ff41";
        shape = "matrix-char";
        texts = ["0", "1", "日", "ﾊ", "ﾐ", "ﾋ", "ｰ", "ｳ", "ｼ", "ﾅ"];
        count = 7;
        initialAlpha = 0.55; // Opacidad inicial más suave para no marear ni saturar
      } else if (theme === "synthwave") {
        color = "#ff007f";
        shape = "synthwave-sun";
        texts = ["★", "80s", "▲", "RETRO"];
        count = 6;
      } else if (theme === "amber") {
        color = "#ffb000";
        shape = "amber-box";
        texts = ["[+]", "RAD", "SYS", "OK"];
        count = 6;
      } else if (theme === "neon") {
        color = "#00f0ff";
        shape = "neon-spark";
        texts = ["◆", "⚡", "SYNC", "01"];
        count = 8;
      } else if (theme === "acid") {
        color = "#ccff00";
        shape = "neon-spark";
        texts = ["X", "⚡", "#", "ACID"];
        count = 8;
      } else if (theme === "upside-down") {
        color = "#ff0033";
        shape = "neon-spark";
        texts = ["✦", "✧", "╱", "╲"];
        count = 8;
      } else if (theme === "arcade-pixel") {
        color = "#ffd700";
        shape = "neon-spark";
        texts = ["👻", "●", "◀", "◆"];
        count = 8;
      } else if (theme === "solar-eclipse") {
        color = "#ff6600";
        shape = "neon-spark";
        texts = ["✦", "☼", "✧", "·"];
        count = 8;
      } else {
        color = "#ffffff";
        shape = "minimal-dot";
        count = 4;
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;

        // Física específica para Matrix: caída vertical lenta y suave
        if (shape === "matrix-char") {
          vx = (Math.random() - 0.5) * 0.4;
          vy = Math.random() * 1.2 + 0.6; // Velocidad reducida drásticamente para evitar mareos
        } else if (shape === "synthwave-sun") {
          vx = (Math.random() - 0.5) * 1.5;
          vy = -(Math.random() * 2 + 1);
        } else if (theme === "upside-down") {
          vx = (Math.random() - 0.5) * 1.1;
          vy = -Math.random() * 1.5;
        } else if (theme === "arcade-pixel") {
          vx = (Math.random() - 0.5) * 2.4;
          vy = (Math.random() - 0.5) * 2.4;
        } else if (theme === "solar-eclipse") {
          vx = (Math.random() - 0.5) * 1.8;
          vy = -Math.random() * 2;
        }

        newParticles.push({
          id: Math.random() + i,
          x,
          y,
          text: texts[Math.floor(Math.random() * texts.length)],
          color,
          size: Math.random() * 6 + 11,
          vx,
          vy,
          alpha: initialAlpha,
          scale: 0.5,
          shape,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [theme]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.025, // Desvanecimiento gradual y sutil
            scale: p.scale + 0.015,
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [particles]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => {
        if (p.shape === "synthwave-sun") {
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: `${p.scale * 35}px`,
                height: `${p.scale * 35}px`,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #ff007f 0%, #ff7b00 100%)",
                boxShadow: "0 0 12px #ff007f",
                opacity: p.alpha,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        }

        if (p.shape === "amber-box") {
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                border: `1px solid ${p.color}`,
                padding: "2px 6px",
                color: p.color,
                fontSize: "10px",
                fontFamily: "'Courier New', monospace",
                backgroundColor: "rgba(51, 34, 0, 0.5)",
                boxShadow: `0 0 6px ${p.color}`,
                opacity: p.alpha,
                transform: `translate(-50%, -50%) scale(${p.scale})`,
              }}
            >
              {p.text}
            </div>
          );
        }

        return (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              color: p.color,
              fontSize: `${p.size}px`,
              fontFamily: p.shape === "matrix-char" ? "monospace" : "sans-serif",
              fontWeight: "bold",
              // Brillo difuminado más suave, menos invasivo con los textos del dashboard
              textShadow: p.shape === "matrix-char" ? `0 0 5px ${p.color}` : `0 0 10px ${p.color}`,
              opacity: p.alpha,
              transform: `translate(-50%, -50%) scale(${p.scale})`,
              whiteSpace: "nowrap",
            }}
          >
            {p.text}
          </span>
        );
      })}
    </div>
  );
}