import { Music2, VolumeX } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "~/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/shared/components/ui/popover";
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
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);
  const preferences = useSyncExternalStore(
    subscribeMusic,
    musicPreferences,
    serverMusicPreferences,
  );
  return (
    <Popover
      onOpenChange={(open) => {
        if (open) setPortalContainer(document.fullscreenElement ?? null);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="BGM設定"
          title="BGM設定"
          className="size-8 shrink-0"
        >
          {preferences.enabled && preferences.volume > 0 ? (
            <Music2 className="size-4" />
          ) : (
            <VolumeX className="size-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 space-y-3"
        align="end"
        portalContainer={portalContainer}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">BGM</span>
          <Button
            size="sm"
            variant="outline"
            aria-pressed={preferences.enabled}
            onClick={() =>
              setMusicPreferences({ enabled: !preferences.enabled })
            }
          >
            {preferences.enabled ? "オン" : "オフ"}
          </Button>
        </div>
        <label className="block space-y-2 text-sm">
          <span className="flex justify-between">
            音量 <output>{Math.round(preferences.volume * 100)}%</output>
          </span>
          <input
            aria-label="BGM音量"
            className="w-full accent-primary"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(preferences.volume * 100)}
            onChange={(event) =>
              setMusicPreferences({ volume: Number(event.target.value) / 100 })
            }
          />
        </label>
      </PopoverContent>
    </Popover>
  );
}
