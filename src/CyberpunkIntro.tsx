import React, { useEffect, useState } from 'react';
import './CyberpunkIntro.css';

interface CyberpunkIntroProps {
  lang: "es" | "en";
  needsName: boolean;
  initialName: string;
  onConfirmName: (name: string) => void;
  onFinish: () => void;
}

export default function CyberpunkIntro({
  lang,
  needsName,
  initialName,
  onConfirmName,
  onFinish,
}: CyberpunkIntroProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [nameDraft, setNameDraft] = useState(initialName);
  const [isLanding, setIsLanding] = useState(false);

  useEffect(() => {
    const startTime = Date.now() + 1500; 
    const duration = 3800;

    const progressInterval = setInterval(() => {
      const now = Date.now();
      if (now >= startTime) {
        const elapsed = now - startTime;
        const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
        }
      }
    }, 40);

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Margen de seguridad de 0.15s para garantizar que el WebView active el canal de audio
        const audioStart = ctx.currentTime + 0.15;

        // --- 1. IMPACTO INDUSTRIAL INICIAL (Volumen máximo y contundente) ---
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(180, audioStart);
        subOsc.frequency.exponentialRampToValueAtTime(50, audioStart + 0.5);
        
        subGain.gain.setValueAtTime(0.7, audioStart); // Volumen alto para asegurar que se escuche
        subGain.gain.exponentialRampToValueAtTime(0.0001, audioStart + 0.6);
        
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(audioStart);
        subOsc.stop(audioStart + 0.6);

        // Capa metálica brillante
        const metalOsc = ctx.createOscillator();
        const metalGain = ctx.createGain();
        const metalFilter = ctx.createBiquadFilter();
        
        metalOsc.type = 'sawtooth';
        metalOsc.frequency.setValueAtTime(350, audioStart);
        metalOsc.frequency.exponentialRampToValueAtTime(100, audioStart + 0.6);
        
        metalFilter.type = 'bandpass';
        metalFilter.frequency.setValueAtTime(700, audioStart);
        metalFilter.Q.value = 3.0;

        metalGain.gain.setValueAtTime(0.35, audioStart);
        metalGain.gain.exponentialRampToValueAtTime(0.0001, audioStart + 0.7);

        metalOsc.connect(metalFilter);
        metalFilter.connect(metalGain);
        metalGain.connect(ctx.destination);
        metalOsc.start(audioStart);
        metalOsc.stop(audioStart + 0.7);


        // --- 2. ZUMBIDO DE MAQUINARIA (Durante la barra de carga) ---
        const humOsc = ctx.createOscillator();
        const humGain = ctx.createGain();
        const humFilter = ctx.createBiquadFilter();

        humOsc.type = 'sawtooth';
        humOsc.frequency.setValueAtTime(110, audioStart + 0.4);
        humOsc.frequency.linearRampToValueAtTime(200, audioStart + 4.5);

        humFilter.type = 'lowpass';
        humFilter.frequency.setValueAtTime(600, audioStart);

        humGain.gain.setValueAtTime(0.001, audioStart);
        humGain.gain.linearRampToValueAtTime(0.18, audioStart + 0.6); // Volumen con presencia clara
        humGain.gain.exponentialRampToValueAtTime(0.0001, audioStart + 5.2);

        humOsc.connect(humFilter);
        humFilter.connect(humGain);
        humGain.connect(ctx.destination);

        humOsc.start(audioStart + 0.4);
        humOsc.stop(audioStart + 5.2);


        // --- 3. DESFOGUE NEUMÁTICO / HISS DE AIRE (Al llegar al 100%) ---
        const hissTime = audioStart + 5.0;
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const hissNoise = ctx.createBufferSource();
        hissNoise.buffer = buffer;

        const hissFilter = ctx.createBiquadFilter();
        hissFilter.type = 'bandpass';
        hissFilter.frequency.setValueAtTime(1800, hissTime);
        hissFilter.frequency.exponentialRampToValueAtTime(3800, hissTime + 0.3);
        hissFilter.frequency.exponentialRampToValueAtTime(400, hissTime + 1.2);
        hissFilter.Q.value = 2.0;

        const hissGain = ctx.createGain();
        hissGain.gain.setValueAtTime(0.001, hissTime);
        hissGain.gain.linearRampToValueAtTime(0.3, hissTime + 0.2);
        hissGain.gain.exponentialRampToValueAtTime(0.0001, hissTime + 1.2);

        hissNoise.connect(hissFilter);
        hissFilter.connect(hissGain);
        hissGain.connect(ctx.destination);

        hissNoise.start(hissTime);
      }
    } catch (e) {
      console.error("Error de audio:", e);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (needsName || isLanding) return;
    const fadeTimer = window.setTimeout(() => setIsFadingOut(true), 5100);
    const finishTimer = window.setTimeout(onFinish, 6200);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [isLanding, needsName, onFinish]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = nameDraft.trim();
    if (!name) return;
    onConfirmName(name);
    setIsLanding(true);
    setIsFadingOut(true);
    window.setTimeout(onFinish, 850);
  };

  return (
    <div className={`cyber-intro-overlay multiverse-intro ${isFadingOut ? "fade-out" : ""}`}>
      <div className="hyperspace-gradient" aria-hidden="true" />
      <div className="hyperspace-tunnel" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className="hyperspace-streaks" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className="cyber-scanlines" aria-hidden="true" />

      <div className={`cyber-intro-content multiverse-content${needsName ? " needs-name" : ""}`}>
        <p className="multiverse-eyebrow">
          {lang === "es" ? "SALTO HIPERESPACIAL // SEÑAL ESTABLE" : "HYPERSPACE JUMP // SIGNAL LOCKED"}
        </p>
        <h1 className="cyber-logo-shine">FOCUS</h1>
        <div className="cyber-sub-text">
          <span>
            {lang === "es"
              ? "SINTONIZANDO EL MULTIVERSO DE FOCUS"
              : "TUNING INTO THE FOCUS MULTIVERSE"}
          </span>
        </div>
        <div className="cyber-loader-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="cyber-loader-fill" style={{ width: `${progress}%` }} />
          <span className="cyber-loader-percentage">{progress}%</span>
        </div>
        {!needsName && (
          <p className="multiverse-status">
            {lang === "es" ? "PREPARANDO ATERRIZAJE" : "PREPARING ARRIVAL"}
          </p>
        )}
        {needsName && (
          <form className="multiverse-name-form" onSubmit={handleSubmit}>
            <p className="multiverse-status">
              {lang === "es"
                ? "Introduce tu alias para sintonizar tu universo"
                : "Enter your alias to tune into your universe"}
            </p>
            <label htmlFor="multiverse-alias">
              {lang === "es" ? "¿CÓMO TE LLAMAMOS?" : "WHAT SHOULD WE CALL YOU?"}
            </label>
            <input
              id="multiverse-alias"
              autoFocus
              required
              maxLength={40}
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder={lang === "es" ? "Tu nombre o alias" : "Your name or alias"}
            />
            <button type="submit" disabled={!nameDraft.trim()}>
              {lang === "es" ? "Sintonizar y comenzar" : "Tune in and begin"}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}