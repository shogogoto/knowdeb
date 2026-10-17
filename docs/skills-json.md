# スキル一覧のJSON入出力

admin → ゲーム → スキルから、編集中の一覧を書き出し、編集したJSONを取り込めます。
削除予約した行は書き出しに含みません。取り込みは同じIDを更新し、新しいIDを追加します。
ファイルにない既存スキルは残ります。表を確認して「保存」を押すまで反映されません。
アイテム・敵・専門分野などの利用設定は、このファイルでは変更しません。

```json
{
  "format": "tanbunism.skills",
  "version": 2,
  "skills": [
    {
      "id": "heal",
      "name": "ケアル",
      "effect": "heal_hp",
      "target": "self",
      "amount": 20,
      "amount_mode": "fixed",
      "mp_cost": 3,
      "animation": "heal"
    }
  ]
}
```

| 項目 | 値 |
|---|---|
| `effect` | `attack`, `heal_hp`, `heal_mp`, `recover_moves`, `equip_attack`, `buff`, `debuff`, `ailment` |
| `target` | `enemy`（敵1体）, `all_enemies`（敵全体）, `self`（自分） |
| `amount_mode` | `fixed`（固定値）, `percent`（対象能力に対する割合） |
| `stat` | `attack`, `defense`, `maxHp` |
| `enabled` | `true`, `false` |

`id` は英小文字から始まる英小文字・数字・アンダースコアで64文字以内。
`name` は1〜80文字。`id`・`name`・`effect` は必須です。
攻撃・debuff・状態異常は敵、それ以外は自分を対象にします。
`amount`・`mp_cost` は0〜10000、`multiplier` は0〜10、
`duration_turns` は1〜20、`stack_limit` は1〜10です。
バブルは `effect: "buff"`, `stat: "maxHp"`, `amount_mode: "percent"` で定義します。
`animation` は演出一覧で選んだものを書き出すとIDを確認できます。

効果種別ごとにキーの組み合わせが異なります。共通項目は
`id`, `name`, `icon`, `enabled`, `effect`, `target`, `amount`, `mp_cost`, `animation` です。

| 効果種別 | 種別ごとの項目 |
|---|---|
| 攻撃 | `amount_mode`, `multiplier` |
| HP・MP回復 | `amount_mode` |
| buff・debuff | `amount_mode`, `stat`, `duration_turns`, `stack_limit` |
| 状態異常 | `amount_mode`, `ailment`, `duration_turns`, `stack_limit` |
| 歩数回復・装備効果 | なし（常に固定値） |

バージョン2では種類に合わないキーをエラーにします。以前のバージョン1は取り込み可能で、
旧形式に含まれていた無関係な既知項目は読み込み時に除去します。

未知の項目・IDの重複・不正な値・既存アイテムや敵の参照を壊す変更は取り込めません。
上限は200スキル、1ファイル1MBです。効果種別などの値はサーバーのStrEnumで定義され、
JSONには上記の文字列のまま保存されます。
