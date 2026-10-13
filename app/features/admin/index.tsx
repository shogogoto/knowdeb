import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "~/features/auth/AuthProvider";
import SectionHeaderTabs from "~/shared/components/SectionHeaderTabs";
import { Tabs, TabsContent } from "~/shared/components/ui/tabs";
import GameAdminManager from "./game";
import ImageManager from "./images";
import LevelSettingsManager from "./levels";
import MaintenanceManager, { maintenanceSections } from "./maintenance";
import PageRankManager from "./pagerank";
import PowerSettingsManager from "./power";
import AdminUserManager from "./users";
import WorkloadSettingsManager from "./workload";

const sections = [
  { id: "users", label: "ユーザー" },
  { id: "workload", label: "負荷制御" },
  { id: "levels", label: "レベル" },
  { id: "game", label: "ゲーム" },
  { id: "power", label: "Power" },
  { id: "pagerank", label: "PageRank" },
  { id: "images", label: "画像" },
  { id: "maintenance", label: "メンテナンス" },
] as const;

function tabPath(tab: string) {
  return tab === "game"
    ? "/admin/game/balance"
    : tab === "maintenance"
      ? "/admin/maintenance/orphans"
      : `/admin/${tab}`;
}

export default function Admin() {
  const { user, isLoading } = useAuth();
  const { tab: routeTab } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const requested = routeTab || view || sections[0].id;
  const legacyMaintenance = maintenanceSections.some((s) => s.id === requested);
  const activeTab = legacyMaintenance
    ? "maintenance"
    : sections.some((s) => s.id === requested)
      ? requested
      : sections[0].id;
  useEffect(() => {
    if (legacyMaintenance) {
      navigate(`/admin/maintenance/${requested}`, { replace: true });
    } else if (!routeTab || activeTab !== requested) {
      navigate(tabPath(activeTab), { replace: true });
    }
  }, [navigate, routeTab, requested, activeTab, legacyMaintenance]);

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">確認中…</p>;
  }
  if (!user?.is_superuser) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <p className="rounded-md border p-4 text-sm text-muted-foreground">
          この画面を利用する権限がありません。
        </p>
      </div>
    );
  }
  return (
    <Tabs value={activeTab} className="gap-0">
      <div className="flex justify-center border-b px-4 py-2 sm:px-6">
        <SectionHeaderTabs
          id="admin-tabs"
          sections={sections}
          label="管理画面の表示切り替え"
          compact
          active={activeTab}
          onSelect={(value) => navigate(tabPath(value))}
        />
      </div>
      <TabsContent
        value="users"
        id="admin-tabs-users-panel"
        aria-labelledby="admin-tabs-users"
        className="mt-0"
      >
        <AdminUserManager />
      </TabsContent>
      <TabsContent
        value="workload"
        id="admin-tabs-workload-panel"
        aria-labelledby="admin-tabs-workload"
        className="mt-0"
      >
        <WorkloadSettingsManager />
      </TabsContent>
      <TabsContent
        value="levels"
        id="admin-tabs-levels-panel"
        aria-labelledby="admin-tabs-levels"
        className="mt-0"
      >
        <LevelSettingsManager />
      </TabsContent>
      <TabsContent
        value="game"
        id="admin-tabs-game-panel"
        aria-labelledby="admin-tabs-game"
        className="mt-0"
      >
        <GameAdminManager />
      </TabsContent>
      <TabsContent
        value="power"
        id="admin-tabs-power-panel"
        aria-labelledby="admin-tabs-power"
        className="mt-0"
      >
        <PowerSettingsManager />
      </TabsContent>
      <TabsContent
        value="pagerank"
        id="admin-tabs-pagerank-panel"
        aria-labelledby="admin-tabs-pagerank"
        className="mt-0"
      >
        <PageRankManager />
      </TabsContent>
      <TabsContent
        value="images"
        id="admin-tabs-images-panel"
        aria-labelledby="admin-tabs-images"
        className="mt-0"
      >
        <ImageManager />
      </TabsContent>
      <TabsContent
        value="maintenance"
        id="admin-tabs-maintenance-panel"
        aria-labelledby="admin-tabs-maintenance"
        className="mt-0"
      >
        <MaintenanceManager />
      </TabsContent>
    </Tabs>
  );
}
