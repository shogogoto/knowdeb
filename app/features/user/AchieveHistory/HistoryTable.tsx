"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/shared/components/ui/table";
import type { AchievementHistories } from "~/shared/generated/fastAPI.schemas";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function HistoryTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// データをテーブル用に加工する
function processForTable(
  aHistories: AchievementHistories,
): AchievementHistoryItem[] {
  const tableData: AchievementHistoryItem[] = [];
  aHistories.forEach((history) => {
    history.archivements.forEach((achievement) => {
      tableData.push({
        date: new Date(achievement.created).toLocaleString("ja-JP"),
        // knowde: history.knowde.name,
        n_char: achievement.n_char,
        n_sentence: achievement.n_sentence,
        n_resource: achievement.n_resource,
      });
    });
  });
  return tableData;
}

type AchievementHistoryItem = {
  date: string;
  n_char: number;
  n_sentence: number;
  n_resource: number;
};

export const columns: ColumnDef<AchievementHistoryItem>[] = [
  {
    accessorKey: "date",
    header: "日時",
  },
  {
    accessorKey: "n_char",
    header: "文字数",
  },
  {
    accessorKey: "n_sentence",
    header: "単文数",
  },
  {
    accessorKey: "n_resource",
    header: "リソース数",
  },
];

type Props = {
  aHistories: AchievementHistories;
};

export default function AchieveHistoryTable({ aHistories }: Props) {
  const data = processForTable(aHistories);
  return <HistoryTable columns={columns} data={data} />;
}
