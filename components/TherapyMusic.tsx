/**
 * TherapyMusic — looping background therapy track with toggle control.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "cmt-therapy-music";
const TRACK_SRC = "/audio/therapy-ambient.mp3";
const TARGET_VOLUME = 0.38;
const FADE_MS = 1200;

export function TherapyMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);

  const clearFade = useCallback(() => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (audio: HTMLAudioElement, targetVolume: number, onDone?: () => void) => {
      clearFade();
      const startVolume = audio.volume;
      const steps = 24;
      const stepMs = FADE_MS / steps;
      let step = 0;

      fadeTimerRef.current = setInterval(() => {
        step += 1;
        const progress = step / steps;
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (step >= steps) {
          audio.volume = targetVolume;
          clearFade();
          onDone?.();
        }
      }, stepMs);
    },
    [clearFade]
  );

  const playTrack = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // Browser may block autoplay until the user interacts with the page.
      }
    }
    fadeTo(audio, TARGET_VOLUME);
  }, [fadeTo]);

  const pauseTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    fadeTo(audio, 0, () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [fadeTo]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setEnabled(stored === null ? true : stored === "on");
    setReady(true);

    return () => {
      clearFade();
    };
  }, [clearFade]);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");

    if (enabled) {
      void playTrack();
    } else {
      pauseTrack();
    }
  }, [enabled, ready, playTrack, pauseTrack]);

  useEffect(() => {
    const resumeOnInteraction = () => {
      if (!enabled || !audioRef.current || !audioRef.current.paused) return;
      void playTrack();
    };

    window.addEventListener("pointerdown", resumeOnInteraction);
    window.addEventListener("keydown", resumeOnInteraction);

    return () => {
      window.removeEventListener("pointerdown", resumeOnInteraction);
      window.removeEventListener("keydown", resumeOnInteraction);
    };
  }, [enabled, playTrack]);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        loop
        preload="auto"
        className="hidden"
        aria-hidden
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={enabled ? "Turn off therapy music" : "Turn on therapy music"}
        aria-pressed={enabled}
        title={enabled ? "Therapy music playing" : "Play soothing therapy music"}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/10 dark:hover:bg-white/10 transition-all hover:scale-105 shadow-lg"
      >
        {enabled ? (
          <svg
            className="h-5 w-5 text-fuchsia-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-theme-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M9 19V6l6-2v4M5 10v4a3 3 0 003 3"
            />
          </svg>
        )}
      </button>
    </>
  );
}
