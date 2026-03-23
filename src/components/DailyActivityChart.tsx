import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DAILY_ACTIVITY_KEY = 'eqa_daily_activity';

interface Props {
  days?: number;
}

function buildDateRange(days: number): { dateKeys: string[]; labels: string[] } {
  const dateKeys: string[] = [];
  const labels: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dateKeys.push(d.toISOString().split('T')[0]);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return { dateKeys, labels };
}

/** 連続学習日数（今日を起点に遡る） */
function calcStreak(activityMap: Record<string, number>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if ((activityMap[key] ?? 0) > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function DailyActivityChart({ days = 30 }: Props) {
  const { labels, counts, todayCount, streak, totalCount, avgCount } = useMemo(() => {
    let activityMap: Record<string, number> = {};
    try {
      const raw = localStorage.getItem(DAILY_ACTIVITY_KEY);
      if (raw) activityMap = JSON.parse(raw);
    } catch { /* ignore */ }

    const { dateKeys, labels: lbls } = buildDateRange(days);
    const counts = dateKeys.map((k) => activityMap[k] ?? 0);

    const todayKey = new Date().toISOString().split('T')[0];
    const todayCount = activityMap[todayKey] ?? 0;

    // 間引き（ラベルは最大8個表示）
    const step = Math.max(1, Math.ceil(days / 8));
    const visibleLabels = lbls.map((l, i) =>
      i % step === 0 || i === days - 1 ? l : ''
    );

    const nonZero = counts.filter((v) => v > 0);
    const totalCount = counts.reduce((s, v) => s + v, 0);
    const avgCount = nonZero.length > 0 ? Math.round(totalCount / nonZero.length) : 0;
    const streak = calcStreak(activityMap);

    return { labels: visibleLabels, counts, todayCount, streak, totalCount, avgCount };
  }, [days]);

  // バーの色：今日は強調色、過去は通常色・0問は薄いグレー
  const backgroundColors = counts.map((count, i) => {
    if (count === 0) return '#E5E7EB';
    return i === days - 1 ? '#6366F1' : '#A5B4FC';
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: '回答数',
        data: counts,
        backgroundColor: backgroundColors,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.raw}問`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, font: { size: 11 } },
      },
      y: {
        min: 0,
        ticks: {
          stepSize: 10,
          font: { size: 11 },
        },
        grid: { color: '#F3F4F6' },
      },
    },
  } as const;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-2">
      <h2 className="text-base font-bold mb-3">日々の学習量（直近{days}日）</h2>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-indigo-50 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-bold text-indigo-600">{todayCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">今日の回答数</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-bold text-amber-500">
            {streak}
            <span className="text-sm font-normal ml-0.5">日</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">連続学習</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-bold text-gray-600">{avgCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">日平均回答</p>
        </div>
      </div>

      {/* 合計 */}
      <p className="text-xs text-gray-400 mb-2 text-right">直近{days}日合計: {totalCount}問</p>

      <Bar data={chartData} options={options} />
    </div>
  );
}
