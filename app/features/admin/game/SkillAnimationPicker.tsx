import { useState } from "react";
import SkillEffect from "~/features/game/SkillEffect";
import { type SkillAnimation, animationLabels } from "~/features/game/catalog";
import { spriteAsset } from "~/features/game/effectAssets";
import { Button } from "~/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/components/ui/dialog";

function Poster({ animation }: { animation: SkillAnimation }) {
  const sprite = spriteAsset(animation);
  return sprite ? (
    <img
      src={sprite.poster}
      alt=""
      loading="lazy"
      className="size-full object-contain"
    />
  ) : animation === "none" ? (
    <span className="text-slate-400">—</span>
  ) : (
    <SkillEffect animation={animation} preview still />
  );
}

export default function SkillAnimationPicker({
  name,
  value,
  onChange,
}: {
  name: string;
  value: SkillAnimation;
  onChange: (animation: SkillAnimation) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [playing, setPlaying] = useState<{ id: SkillAnimation; key: number }>();
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setSelected(value);
          setPlaying(undefined);
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={`${name}の演出を選ぶ`}
          className="h-10 w-40 justify-start gap-2 px-2"
        >
          <span className="relative isolate flex size-7 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-950">
            <Poster animation={value} />
          </span>
          <span className="truncate">{animationLabels[value]}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] w-[min(64rem,calc(100vw-2rem))] max-w-none flex-col sm:max-w-none">
        <DialogHeader>
          <DialogTitle>{name}の演出を選ぶ</DialogTitle>
          <DialogDescription>
            静止画をクリックすると、その場で再生します。
          </DialogDescription>
        </DialogHeader>
        <div
          className="grid min-h-0 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4 lg:grid-cols-5"
          aria-label="演出素材一覧"
        >
          {Object.entries(animationLabels).map(([key, label]) => {
            const id = key as SkillAnimation;
            return (
              <button
                key={id}
                type="button"
                aria-label={`${label}をプレビュー`}
                aria-pressed={selected === id}
                className="flex min-w-0 flex-col items-center gap-2 rounded-lg border p-2 text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary/10"
                onClick={() => {
                  setSelected(id);
                  setPlaying((p) => ({ id, key: (p?.key ?? 0) + 1 }));
                }}
              >
                <div
                  className="relative isolate flex size-24 max-w-full shrink-0 items-center justify-center overflow-hidden rounded bg-slate-950"
                  onAnimationEnd={() =>
                    setPlaying((p) => (p?.id === id ? undefined : p))
                  }
                >
                  {playing?.id === id && id !== "none" ? (
                    <SkillEffect key={playing.key} animation={id} preview />
                  ) : (
                    <Poster animation={id} />
                  )}
                </div>
                <span className="max-w-full truncate">{label}</span>
              </button>
            );
          })}
        </div>
        <DialogFooter className="items-center">
          <span className="mr-auto text-sm">
            選択中：{animationLabels[selected]}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            閉じる
          </Button>
          <Button
            type="button"
            disabled={selected === value}
            onClick={() => {
              onChange(selected);
              setOpen(false);
            }}
          >
            この演出を使う
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
