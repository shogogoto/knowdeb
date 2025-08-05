"use client";

import type * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useIsMobile } from "~/hooks/use-mobile";

interface HybridTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

// tooltipはmobile非推奨のため、モバイルではPopoverを使う
export default function HybridTooltip({
  content,
  children,
}: HybridTooltipProps) {
  // 画面幅が768px（mdブレイクポイント）以上かどうかを判定
  const isMobile = !useIsMobile();

  if (!isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent>{content}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto">{content}</PopoverContent>
    </Popover>
  );
}
