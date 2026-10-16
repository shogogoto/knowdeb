import {
  Bird,
  BookOpen,
  Bug,
  Cat,
  Coins,
  Crown,
  Droplet,
  Flame,
  FlaskConical,
  Footprints,
  Gem,
  Ghost,
  Heart,
  Scroll,
  Shield,
  Skull,
  Snowflake,
  Sparkles,
  Sword,
  Swords,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/components/ui/dialog";
import { Input } from "~/shared/components/ui/input";

export const gameIcons = {
  sword: { label: "剣", Icon: Sword },
  swords: { label: "双剣", Icon: Swords },
  flame: { label: "炎", Icon: Flame },
  snowflake: { label: "氷", Icon: Snowflake },
  zap: { label: "雷", Icon: Zap },
  sparkles: { label: "光", Icon: Sparkles },
  wand: { label: "魔法の杖", Icon: WandSparkles },
  heart: { label: "ハート", Icon: Heart },
  shield: { label: "盾", Icon: Shield },
  droplet: { label: "しずく", Icon: Droplet },
  flask: { label: "薬瓶", Icon: FlaskConical },
  footprints: { label: "足跡", Icon: Footprints },
  coins: { label: "ゴールド", Icon: Coins },
  gem: { label: "宝石", Icon: Gem },
  scroll: { label: "巻物", Icon: Scroll },
  book: { label: "本", Icon: BookOpen },
  ghost: { label: "ゴースト", Icon: Ghost },
  bug: { label: "虫", Icon: Bug },
  skull: { label: "ドクロ", Icon: Skull },
  crown: { label: "王冠", Icon: Crown },
  bird: { label: "鳥", Icon: Bird },
  cat: { label: "猫", Icon: Cat },
};
export default function GameIcon({
  icon,
  className = "size-5",
}: { icon?: string | null; className?: string }) {
  const { Icon } =
    gameIcons[icon as keyof typeof gameIcons] ?? gameIcons.sparkles;
  return <Icon aria-hidden="true" className={className} />;
}
export function IconPicker({
  value,
  onChange,
  label = "アイコン",
}: { value: string; onChange: (value: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" aria-label={`${label}を選ぶ`}>
          <GameIcon icon={value} />
          {gameIcons[value as keyof typeof gameIcons]?.label ?? "選択"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>アイコン素材一覧</DialogTitle>
          <DialogDescription className="sr-only">
            名前で絞り込んで素材を選択してください。
          </DialogDescription>
        </DialogHeader>
        <Input
          aria-label="素材を検索"
          placeholder="素材を検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Object.entries(gameIcons)
            .filter(([id, item]) =>
              `${id} ${item.label}`.toLowerCase().includes(query.toLowerCase()),
            )
            .map(([id, item]) => (
              <button
                key={id}
                type="button"
                aria-pressed={value === id}
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                }}
                className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border p-2 text-sm hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary"
              >
                <GameIcon icon={id} className="size-8" />
                {item.label}
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
