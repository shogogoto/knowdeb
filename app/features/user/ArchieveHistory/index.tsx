import { format, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AchievementHistories } from "~/shared/generated/fastAPI.schemas";

type Props = {
  aHistories: AchievementHistories;
};

type ChartData = {
  week: string;
  n_char: number;
  n_sentence: number;
  n_resource: number;
};

function processAchievementData(aHistories: AchievementHistories): ChartData[] {
  const weeklyDataMap = new Map<string, ChartData>();

  aHistories.forEach((history) => {
    history.archivements.forEach((achievement) => {
      const date = new Date(achievement.created);
      const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 }); // 月曜日始まり
      const weekKey = format(startOfWeekDate, "yyyy-MM-dd"); // 週の開始日をキーとする

      if (!weeklyDataMap.has(weekKey)) {
        weeklyDataMap.set(weekKey, {
          week: format(startOfWeekDate, "yyyy/MM/dd", { locale: ja }),
          n_char: achievement?.n_char || 0,
          n_sentence: achievement?.n_sentence || 0,
          n_resource: achievement?.n_resource || 0,
        });
      }
    });
  });
  // 週ごとにソート
  const sortedData = Array.from(weeklyDataMap.values()).sort((a, b) => {
    const dateA = new Date(a.week);
    const dateB = new Date(b.week);
    return dateA.getTime() - dateB.getTime();
  });

  return sortedData;
}

export default function ArchieveHistory({ aHistories }: Props) {
  const chartData = processAchievementData(aHistories);

  if (!chartData || chartData.length === 0) {
    return <div>表示するデータがありません。</div>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="week" angle={-20} textAnchor="end" height={60} /> */}
          <XAxis dataKey="week" />
          <YAxis yAxisId="char" stroke="#8884d8" />
          <YAxis yAxisId="sentence" orientation="right" stroke="#82ca9d" />
          <YAxis yAxisId="resource" orientation="right" stroke="#ffc658" />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="n_char"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="文字数"
            yAxisId="char"
          />
          <Line
            type="monotone"
            dataKey="n_sentence"
            stroke="#82ca9d"
            name="文章数"
            yAxisId="sentence"
          />
          <Line
            type="monotone"
            dataKey="n_resource"
            stroke="#ffc658"
            name="リソース数"
            yAxisId="resource"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
