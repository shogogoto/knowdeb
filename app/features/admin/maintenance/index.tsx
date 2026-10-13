import { useNavigate, useParams } from "react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/shared/components/ui/tabs";
import BrokenQuizManager from "../brokenQuizzes";
import OrphanedTanbunManager from "../orphanedTanbuns";

export const maintenanceSections = [
  { id: "orphans", label: "孤立Tanbun" },
  { id: "misplaced", label: "配置切れTanbun" },
  { id: "broken-quizzes", label: "参照切れQuiz" },
] as const;

export default function MaintenanceManager() {
  const { subtab, tab } = useParams();
  const navigate = useNavigate();
  const requested = tab === "maintenance" ? subtab : tab;
  const active = maintenanceSections.some((s) => s.id === requested)
    ? requested
    : "orphans";
  return (
    <Tabs
      value={active}
      onValueChange={(value) => navigate(`/admin/maintenance/${value}`)}
      className="gap-0"
    >
      <div className="flex justify-center border-b px-4 py-2">
        <TabsList
          aria-label="メンテナンスの表示切り替え"
          className="h-auto flex-wrap justify-center"
        >
          {maintenanceSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="orphans" className="mt-0">
        <OrphanedTanbunManager kind="orphaned" />
      </TabsContent>
      <TabsContent value="misplaced" className="mt-0">
        <OrphanedTanbunManager kind="misplaced" />
      </TabsContent>
      <TabsContent value="broken-quizzes" className="mt-0">
        <BrokenQuizManager />
      </TabsContent>
    </Tabs>
  );
}
