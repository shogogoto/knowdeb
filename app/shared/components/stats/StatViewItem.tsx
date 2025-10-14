import type { LucideIcon } from "lucide-react";
import HybridTooltip from "../HybridTooltip";

export default function StatViewItem({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: number | string | undefined;
}) {
  return (
    <HybridTooltip content={label}>
      <div className="flex items-center gap-1">
        <Icon className="size-4 cursor-pointer text-muted-foreground" />
        <div className="font-mono text-sm text-right">{value}</div>
      </div>
    </HybridTooltip>
  );
}
