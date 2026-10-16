import { useEffect, useState } from "react";
import { type GameCatalog, requestGameCatalog } from "~/features/game/catalog";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";

const conditions = {
  always: "いつでも",
  hp_below: "HPがn%以下",
  mp_below: "MPがn%以下",
  enemy_count: "敵がn体以上",
  buff_present: "buffあり",
  buff_absent: "buffなし",
  poisoned: "毒状態",
};
export default function TriggerEditor() {
  const [catalog, setCatalog] = useState<GameCatalog>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    void requestGameCatalog(true)
      .then((value) => {
        if (active) setCatalog(value);
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, []);
  function patch(id: string, value: object) {
    setSaved(false);
    setCatalog((c) =>
      c
        ? {
            ...c,
            triggers: c.triggers?.map((t) =>
              t.id === id ? { ...t, ...value } : t,
            ),
          }
        : c,
    );
  }
  return (
    <section
      className="mx-auto max-w-5xl p-4 space-y-4"
      aria-label="ガンビット条件定義"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">ガンビットのトリガー</h2>
        <Button
          disabled={!catalog || busy}
          onClick={() =>
            setCatalog((c) =>
              c
                ? {
                    ...c,
                    triggers: [
                      ...(c.triggers ?? []),
                      {
                        id: `trigger_${crypto.randomUUID().replaceAll("-", "")}`,
                        name: "新しい条件",
                        condition: "hp_below",
                        threshold: 30,
                        enabled: true,
                      },
                    ],
                  }
                : c,
            )
          }
        >
          追加
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!catalog || busy) return;
          setBusy(true);
          setError(undefined);
          try {
            setCatalog(await requestGameCatalog(true, catalog));
            setSaved(true);
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "保存できませんでした。",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={!catalog || busy}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["名前", "条件", "初期値n", "有効"].map((h) => (
                    <th key={h} className="p-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catalog?.triggers?.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">
                      <Input
                        aria-label="条件の名前"
                        value={t.name}
                        required
                        maxLength={80}
                        onChange={(e) => patch(t.id, { name: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        aria-label="判定する条件"
                        className="h-9 rounded-md border bg-background"
                        value={t.condition}
                        onChange={(e) =>
                          patch(t.id, { condition: e.target.value })
                        }
                      >
                        {Object.entries(conditions).map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      {["hp_below", "mp_below", "enemy_count"].includes(
                        t.condition,
                      ) && (
                        <Input
                          aria-label="初期値n"
                          type="number"
                          min={1}
                          max={t.condition === "enemy_count" ? 20 : 100}
                          value={t.threshold}
                          onChange={(e) =>
                            patch(t.id, { threshold: e.target.valueAsNumber })
                          }
                        />
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        aria-label="有効"
                        type="checkbox"
                        checked={t.enabled}
                        onChange={(e) =>
                          patch(t.id, { enabled: e.target.checked })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="submit">保存</Button>
          </div>
        </fieldset>
      </form>
      {saved && <output>保存しました</output>}
    </section>
  );
}
