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
import type { YAxisOrientation } from "recharts/types/state/cartesianAxisSlice";
import type { AchievementHistories } from "~/shared/generated/fastAPI.schemas";
import AchieveHistoryTable from "./HistoryTable";

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

export default function AchieveHistory({ aHistories }: Props) {
  const chartData = processAchievementData(aHistories);

  if (!chartData || chartData.length === 0) {
    return <div>表示するデータがありません。</div>;
  }

  const [charY, charLine] = materials("n_char", "文字数", "#8884d8");
  const [senY, senLine] = materials("n_sentence", "文章数", "#82ca9d", "right");
  const [rY, rLine] = materials("n_resource", "リソース数", "#ffc658", "right");
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", height: 300 }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          活動履歴
        </h2>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            {charY}
            {senY}
            {rY}
            <Tooltip
              contentStyle={{ backgroundColor: "#333", color: "#fff" }}
            />
            <Legend />
            {charLine}
            {senLine}
            {rLine}
          </LineChart>
        </ResponsiveContainer>
        <AchieveHistoryTable aHistories={aHistories} />
      </div>
    </div>
  );
}

// LineとYAxisを返す
function materials(
  id: string,
  caption: string,
  stroke: string,
  orientation?: YAxisOrientation,
) {
  const yAxis = (
    <YAxis
      yAxisId={id}
      stroke={stroke}
      orientation={orientation}
      domain={[
        (dataMin) => Math.floor(dataMin * 0.95),
        (dataMax) => Math.ceil(dataMax * 1.05),
      ]}
    />
  );

  const line = (
    <Line
      type="monotone"
      dataKey={id}
      stroke={stroke}
      //activeDot={{ r: 8 }}
      name={caption}
      yAxisId={id}
    />
  );
  return [yAxis, line];
}
