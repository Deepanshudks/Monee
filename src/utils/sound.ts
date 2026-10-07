import { useAudioPlayer } from "expo-audio";
import { useCallback, useRef } from "react";

export function useAppSounds(enabled = true) {
  const tapPlayer = useAudioPlayer(require("../../assets/sounds/tap.wav"));

  const successPlayer = useAudioPlayer(
    require("../../assets/sounds/success.wav"),
  );

  const playingRef = useRef(false);

  const play = useCallback(
    (kind: "tap" | "success" = "tap") => {
      if (!enabled || playingRef.current) return;

      const player = kind === "success" ? successPlayer : tapPlayer;

      if (!player) return;

      playingRef.current = true;

      Promise.resolve()
        .then(() => player.play())
        .catch((error) => {
          console.warn("Sound playback failed:", error);
        })
        .finally(() => {
          playingRef.current = false;
        });
    },
    [enabled, tapPlayer, successPlayer],
  );

  return { play };
}
