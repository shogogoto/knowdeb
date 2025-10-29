import { useCallback, useRef } from "react";

export const useSelectPreventLink = (threshold = 5) => {
  // マウスが押された瞬間の座標を記録
  const initialPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 左クリック（ボタン0）でのみ処理を行う
      if (e.button !== 0) return;

      // 状態をリセットし、初期位置を記録
      hasMoved.current = false;
      initialPos.current = { x: e.clientX, y: e.clientY };

      // マウスが動いたか判定するためのリスナーを設定
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = Math.abs(moveEvent.clientX - initialPos.current.x);
        const dy = Math.abs(moveEvent.clientY - initialPos.current.y);

        // 移動距離が閾値を超えたらドラッグと見なす
        if (dx > threshold || dy > threshold) {
          hasMoved.current = true;
          // 一度動いたことが分かったら、リスナーは不要なので削除
          document.removeEventListener("mousemove", handleMouseMove);
        }
      };

      // マウスボタンが離れたら、mousemove リスナーを必ず削除する
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [threshold],
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    // もしマウスが動いていた（ドラッグされた）場合は、ページ遷移をキャンセル
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      // 次のクリックのために状態をリセット
      hasMoved.current = false;
    }
  }, []);

  return { handleMouseDown, handleClick };
};
