import { useAudioPlayer } from "expo-audio";
import { useCallback } from "react";

export type SoundType =
  | "tap"
  | "success"
  | "expense"
  | "delete"
  | "warning"
  | "error"
  | "transition";

export type VoiceType =
  | "yatta"
  | "yosh"
  | "sugoi"
  | "nani"
  | "oi"
  | "yabai"
  | "sayonara"
  | "ikuzo"
  | "otsukaresama";

export function useAppSounds(soundEnabled = true, voiceEnabled = true) {
  const tapPlayer = useAudioPlayer(require("../../assets/sounds/tap.wav"));
  // const tapPlayer = useAudioPlayer(require("../../assets/sounds/tap.wav"));

  const successPlayer = useAudioPlayer(
    require("../../assets/sounds/success.wav"),
  );

  const expensePlayer = useAudioPlayer(
    require("../../assets/sounds/expense.wav"),
  );

  const deletePlayer = useAudioPlayer(
    require("../../assets/sounds/delete.wav"),
  );

  const warningPlayer = useAudioPlayer(
    require("../../assets/sounds/warning.wav"),
  );

  const errorPlayer = useAudioPlayer(require("../../assets/sounds/error.wav"));

  const transitionPlayer = useAudioPlayer(
    require("../../assets/sounds/transition.wav"),
  );

  // Anime voices
  const yattaPlayer = useAudioPlayer(require("../../assets/voices/yatta.mp3"));

  const yoshPlayer = useAudioPlayer(require("../../assets/voices/yosh.mp3"));

  const sugoiPlayer = useAudioPlayer(require("../../assets/voices/sugoi.mp3"));

  const naniPlayer = useAudioPlayer(require("../../assets/voices/nani.mp3"));

  const oiPlayer = useAudioPlayer(require("../../assets/voices/oi.mp3"));

  const yabaiPlayer = useAudioPlayer(require("../../assets/voices/yabai.mp3"));

  const sayonaraPlayer = useAudioPlayer(
    require("../../assets/voices/sayonara.mp3"),
  );

  const ikuzoPlayer = useAudioPlayer(require("../../assets/voices/Ikuzo.mp3"));

  const otsukaresamaPlayer = useAudioPlayer(
    require("../../assets/voices/otsukaresama.mp3"),
  );

  const play = useCallback(
    (kind: SoundType = "tap") => {
      if (!soundEnabled) return;

      const players: Record<SoundType, typeof tapPlayer> = {
        tap: tapPlayer,
        success: successPlayer,
        expense: expensePlayer,
        delete: deletePlayer,
        warning: warningPlayer,
        error: errorPlayer,
        transition: transitionPlayer,
      };

      const player = players[kind];

      if (!player) return;

      try {
        player.seekTo(0);
        player.play();
      } catch (error) {
        console.warn("[Monee] SFX playback failed:", error);
      }
    },
    [
      soundEnabled,
      tapPlayer,
      successPlayer,
      expensePlayer,
      deletePlayer,
      warningPlayer,
      errorPlayer,
      transitionPlayer,
    ],
  );

  const playVoice = useCallback(
    (kind: VoiceType) => {
      if (!voiceEnabled) return;

      const players: Record<VoiceType, typeof yattaPlayer> = {
        yatta: yattaPlayer,
        yosh: yoshPlayer,
        sugoi: sugoiPlayer,
        nani: naniPlayer,
        oi: oiPlayer,
        yabai: yabaiPlayer,
        sayonara: sayonaraPlayer,
        ikuzo: ikuzoPlayer,
        otsukaresama: otsukaresamaPlayer,
      };

      const player = players[kind];

      if (!player) return;

      try {
        player.seekTo(0);
        player.play();
      } catch (error) {
        console.warn("[Monee] Voice playback failed:", error);
      }
    },
    [
      voiceEnabled,
      yattaPlayer,
      yoshPlayer,
      sugoiPlayer,
      naniPlayer,
      oiPlayer,
      yabaiPlayer,
      sayonaraPlayer,
      ikuzoPlayer,
      otsukaresamaPlayer,
    ],
  );

  return {
    play,
    playVoice,
  };
}
