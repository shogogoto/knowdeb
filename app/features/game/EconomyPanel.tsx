import { Coins, Footprints, Heart, Sword } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import useSWR from "swr";
import { Button } from "~/shared/components/ui/button";
import { gameRequest } from "./battle";
import type { GameSave } from "./domain";
import { type GameState, requestGameState } from "./state";

type Product = {
  id: string;
  name: string;
  price: number | null;
  kind: "weapon" | "hp" | "moves";
  amount: number;
};
type Shop = {
  products: Product[];
  specialties?: {
    resource_id: string;
    name: string;
    level: number;
    quiz_count: number;
  }[];
  review: { day: string; done: number; total: number; claimed: boolean };
  quiz_review?: { day: string; done: number; total: number; claimed: boolean };
};

export default function EconomyPanel({
  userId,
  save,
  revision,
  shop,
  disabled,
  onSaved,
  onTab,
}: {
  userId: string;
  save: GameSave;
  revision: number;
  shop: boolean;
  disabled: boolean;
  onSaved: (state: GameState) => void;
  onTab: (panel: "shop" | "item") => void;
}) {
  const {
    data,
    error: loadError,
    mutate,
  } = useSWR(["game-shop", userId], () => gameRequest<Shop>("shop"), {
    revalidateOnFocus: true,
  });
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState<string>();
  const inventory = save.economy?.inventory ?? {};
  async function act(product: Product, action: "buy" | "equip" | "use") {
    if (pending.current || disabled) return;
    pending.current = true;
    setBusy(true);
    setError(undefined);
    try {
      onSaved(
        await gameRequest<GameState>(
          action === "buy" ? "shop/buy" : `inventory/${action}`,
          {
            revision,
            product_id: product.id,
          },
        ),
      );
      void mutate();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "操作できませんでした。",
      );
      await requestGameState()
        .then(onSaved)
        .catch(() => undefined);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant={shop ? "outline" : "default"}
            onClick={() => onTab("item")}
          >
            所持品
          </Button>
          <Button
            variant={shop ? "default" : "outline"}
            onClick={() => onTab("shop")}
          >
            ショップ
          </Button>
        </div>
        <span className="flex items-center gap-1 text-amber-400 tabular-nums">
          <Coins className="size-4" />
          {save.economy?.gold ?? 0} G
        </span>
      </div>
      {(error || loadError) && (
        <p role="alert" className="text-sm text-destructive">
          {error ?? loadError.message}
        </p>
      )}
      {!data && !loadError && (
        <p className="text-sm text-muted-foreground">読み込み中…</p>
      )}
      {data?.products
        .filter((product) =>
          shop ? product.price !== null : (inventory[product.id] ?? 0) > 0,
        )
        .map((product) => {
          const quantity = inventory[product.id] ?? 0;
          const equipped = save.economy?.weapon === product.id;
          const Icon =
            product.kind === "weapon"
              ? Sword
              : product.kind === "hp"
                ? Heart
                : Footprints;
          const unavailable = shop
            ? (save.economy?.gold ?? 0) < (product.price ?? 0) ||
              (product.kind === "weapon" && quantity > 0)
            : (!save.run && product.kind !== "weapon") ||
              (product.kind === "hp" && save.run?.hp === save.run?.maxHp) ||
              (product.kind === "moves" && save.run?.moves === 0);
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <Icon className="size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {product.name}
                  {!shop && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ×{quantity}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.kind === "weapon"
                    ? `攻 +${product.amount}`
                    : product.kind === "hp"
                      ? `HP ${product.amount}回復`
                      : `${product.amount}歩回復`}
                  {equipped && " · 装備中"}
                </p>
              </div>
              <Button
                disabled={disabled || busy || unavailable}
                variant="outline"
                onClick={() =>
                  void act(
                    product,
                    shop ? "buy" : product.kind === "weapon" ? "equip" : "use",
                  )
                }
              >
                {shop
                  ? product.kind === "weapon" && quantity > 0
                    ? "所持済み"
                    : `${product.price} G`
                  : product.kind === "weapon"
                    ? equipped
                      ? "外す"
                      : "装備"
                    : "使う"}
              </Button>
            </div>
          );
        })}
      {!shop && data && !Object.values(inventory).some((n) => n > 0) && (
        <p className="text-sm text-muted-foreground">
          まだアイテムを持っていません。
        </p>
      )}
      {!shop && (
        <div className="rounded-lg border p-3 text-sm space-y-2">
          <p className="font-medium">専門分野</p>
          {Object.entries(save.bossClears ?? {})
            .filter(([, levels]) => levels.length)
            .map(([resource, levels]) => {
              const title =
                save.run?.resourceId.replaceAll("-", "") === resource
                  ? save.run.name
                  : (save.dungeons?.[resource]?.run.name ??
                    save.unlockedDungeons?.find(
                      (d) => d.resourceId.replaceAll("-", "") === resource,
                    )?.name ??
                    "攻略済みリソース");
              return (
                <p key={resource} className="text-muted-foreground">
                  {data?.specialties?.find((s) => s.resource_id === resource)
                    ?.name ?? title}{" "}
                  · 達成度 {Math.max(...levels)}まで
                </p>
              );
            })}
          {!Object.values(save.bossClears ?? {}).some(
            (levels) => levels.length,
          ) && (
            <p className="text-muted-foreground">ボスを倒すと登録されます。</p>
          )}
        </div>
      )}
      {disabled && (
        <p className="text-sm text-muted-foreground">
          戦闘が終わってから操作できます。
        </p>
      )}
      <div className="rounded-lg border p-3 text-sm space-y-2">
        <p className="font-medium">今日の見たよ → 歩数回復薬 ×1</p>
        <p className="text-muted-foreground">
          {data?.review.claimed
            ? "今日の報酬は受け取り済み"
            : data?.review.total
              ? `${data.review.done} / ${data.review.total}`
              : "「今日」の復習を始めると対象が決まります。"}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/review?preset=default">復習へ</Link>
        </Button>
        <p className="font-medium">今日の復習クイズ20問 → 歩数回復薬 ×1</p>
        <p className="text-muted-foreground">
          {data?.quiz_review?.claimed
            ? "今日の報酬は受け取り済み"
            : `${Math.min(20, data?.quiz_review?.done ?? 0)} / 20`}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/review?view=quiz&preset=default">クイズを解く</Link>
        </Button>
      </div>
    </div>
  );
}
