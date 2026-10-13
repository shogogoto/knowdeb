import { Music2, VolumeX } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "~/shared/components/ui/button";
import {
  type MusicScene,
  musicPreferences,
  registerMusic,
  serverMusicPreferences,
  setMusicPreferences,
  subscribeMusic,
} from "./music";

export function useGameMusic(mode: MusicScene | null) {
  useEffect(() => (mode ? registerMusic(mode) : undefined), [mode]);
}

export default function MusicControls() {
  const { enabled } = useSyncExternalStore(
    subscribeMusic,
    musicPreferences,
    serverMusicPreferences,
  );
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="BGM"
      aria-pressed={enabled}
      title={enabled ? "BGMをオフにする" : "BGMをオンにする"}
      className="size-8 shrink-0"
      onClick={() => setMusicPreferences({ enabled: !enabled })}
    >
      {enabled ? <Music2 className="size-4" /> : <VolumeX className="size-4" />}
    </Button>
  );
}
