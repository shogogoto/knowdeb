import { createContext, useContext, useState } from "react";
import { Link } from "react-router";
import useSWR from "swr";
import { getQuizChain } from "~/features/quiz/api";
import Loading from "~/shared/components/Loading";
import { Button } from "~/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/shared/components/ui/dialog";
import { canonicalSentenceId } from "./cache";
import TanbunChainView from "./index";

type PreviewTarget =
  | { sentenceId: string }
  | {
      quizId: string;
      role: "target" | "correct";
      sentence?: string;
    };

const ContainedPreviewContext = createContext(false);
export const ContainedTanbunPreviews = ContainedPreviewContext.Provider;

/** 元のTL・回答フォームをアンマウントせず詳細だけ開く。 */
export function useTanbunPreview() {
  const [target, setTarget] = useState<PreviewTarget>();
  return {
    openPreview: setTarget,
    preview: target ? (
      <TanbunPreviewDialog
        target={target}
        onClose={() => setTarget(undefined)}
      />
    ) : null,
  };
}

export function TanbunPreviewDialog({
  target,
  onClose,
}: {
  target: PreviewTarget;
  onClose: () => void;
}) {
  const contained = useContext(ContainedPreviewContext);
  const [nestedId, setNestedId] = useState<string>();
  const [history, setHistory] = useState<string[]>([]);
  const quizId = "quizId" in target ? target.quizId : undefined;
  const {
    data: chain,
    error,
    isLoading,
    mutate,
  } = useSWR(
    quizId ? ["tanbun-preview-quiz", quizId] : null,
    () => getQuizChain(quizId as string),
    {
      dedupingInterval: 5 * 60_000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
  const resolvedId =
    "sentenceId" in target
      ? target.sentenceId
      : chain?.links.find(
          (link) =>
            canonicalSentenceId(link.quiz_id) ===
              canonicalSentenceId(target.quizId) &&
            link.role === target.role &&
            (!target.sentence ||
              chain.sentences.some(
                (sentence) =>
                  sentence.uid === link.sentence_id &&
                  sentence.sentence === target.sentence,
              )),
        )?.sentence_id;
  const sentenceId = nestedId ?? resolvedId;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-h-[92dvh] min-w-0 overflow-y-auto p-3 sm:max-w-4xl sm:p-5"
        data-dashboard-swipe-ignore
        onClickCapture={(event) => {
          if (!contained) return;
          const anchor = (event.target as Element).closest("a[href]");
          if (!anchor) return;
          const path = new URL(
            (anchor as HTMLAnchorElement).href,
            window.location.href,
          ).pathname;
          const match = path.match(/^\/tanbun\/([^/]+)\/?$/);
          if (!match) return;
          event.preventDefault();
          event.stopPropagation();
          const next = canonicalSentenceId(decodeURIComponent(match[1]));
          if (sentenceId && next !== canonicalSentenceId(sentenceId)) {
            setHistory((previous) => [...previous, sentenceId]);
            setNestedId(next);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>単文詳細</DialogTitle>
          <DialogDescription className="sr-only">
            閉じると復習を続けられます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-2">
          {contained ? (
            history.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNestedId(history.at(-1));
                  setHistory((previous) => previous.slice(0, -1));
                }}
              >
                戻る
              </Button>
            ) : (
              <span />
            )
          ) : sentenceId ? (
            <Link
              to={`/tanbun/${canonicalSentenceId(sentenceId)}`}
              className="text-sm text-primary hover:underline"
            >
              単文ページを開く
            </Link>
          ) : (
            <span />
          )}
          <Button size="sm" variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
        {sentenceId ? (
          <TanbunChainView id={sentenceId} preview />
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-2">
            <p role="alert">
              {error instanceof Error
                ? error.message
                : "クイズ対象の単文が見つかりませんでした。"}
            </p>
            <Button variant="outline" onClick={() => void mutate()}>
              再読み込み
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
