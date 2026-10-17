import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotificationPage from "./NotificationPage";
import { NotificationProvider } from "./NotificationProvider";
import {
  getPushConfiguration,
  listNotifications,
  markAllNotificationsRead,
} from "./api";
import { notifyNotificationsChanged } from "./events";

vi.mock("./api", () => ({
  deletePushSubscription: vi.fn(),
  getPushConfiguration: vi.fn(),
  listNotifications: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  markNotificationRead: vi.fn(),
  savePushSubscription: vi.fn(),
}));

const notification = {
  uid: "10000000-0000-0000-0000-000000000001",
  kind: "quiz_preparation_complete" as const,
  title: "クイズの準備完了",
  description: "3問追加しました。",
  href: "/dashboard?view=study-plans",
  created: "2026-09-29T12:00:00+09:00",
  read_at: null,
};

describe("NotificationPage", () => {
  beforeEach(() => {
    vi.mocked(listNotifications).mockResolvedValue({
      notifications: [notification],
      unread_count: 1,
    });
    vi.mocked(getPushConfiguration).mockResolvedValue({
      enabled: false,
      public_key: null,
    });
    vi.mocked(markAllNotificationsRead).mockResolvedValue({ updated_count: 1 });
  });

  it("DB通知を一覧表示した時点ですべて既読にする", async () => {
    render(
      <MemoryRouter>
        <NotificationProvider userId="user-1">
          <NotificationPage />
        </NotificationProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("クイズの準備完了")).toBeVisible();
    expect(screen.getByText("3問追加しました。")).toBeVisible();
    const link = screen.getByRole("link", { name: /クイズの準備完了/ });
    expect(link).toHaveAttribute("href", "/dashboard?view=study-plans");

    await waitFor(() =>
      expect(markAllNotificationsRead).toHaveBeenCalledOnce(),
    );
  });

  it("import完了の更新通知ですぐに開放キーの通知を取得し、所持品へのリンクを表示する", async () => {
    vi.mocked(listNotifications).mockResolvedValue({
      notifications: [],
      unread_count: 0,
    });
    render(
      <MemoryRouter>
        <NotificationProvider userId="user-1">
          <NotificationPage />
        </NotificationProvider>
      </MemoryRouter>,
    );
    await screen.findByText("通知はありません");
    vi.mocked(listNotifications).mockResolvedValue({
      notifications: [
        {
          ...notification,
          kind: "dungeon_key_granted",
          title: "ダンジョン開放キーを入手しました",
          description: "読書メモの開放キーを1個入手しました。",
          href: "/game/item",
        },
      ],
      unread_count: 1,
    });
    act(() => notifyNotificationsChanged());
    expect(
      await screen.findByRole("link", {
        name: /ダンジョン開放キーを入手しました/,
      }),
    ).toHaveAttribute("href", "/game/item");
    expect(
      screen.getByText("読書メモの開放キーを1個入手しました。"),
    ).toBeVisible();
  });
});
