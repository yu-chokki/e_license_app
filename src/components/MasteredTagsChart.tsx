import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { isMastered } from '../hooks/useProgress';
import type { Progress } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DAILY_SNAPSHOT_KEY = 'eqa_daily_snapshot';
const TOTAL_TAGS = 64;

interface Props {
  days?: number;
}

function buildLabels(days: number): string[] {
  const labels: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return labels;
}

function buildDateKeys(days: number): string[] {
  const keys: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    keys.push(d.toISOString().split('T')[0]);
  }
  return keys;
}

export default function MasteredTagsChart({ days = 30 }: Props) {
  const { masteredToday, labels, masteredData, remainData } = useMemo(() => {
    // 現在の習得済みタグ数（スナップショットより正確）
    let currentMastered = 0;
    try {
      const raw = localStorage.getItem('eqa_progress');
      if (raw) {
        const progress: Progress = JSON.parse(raw);
        currentMastered = Object.values(progress).filter(isMastered).length;
      }
    } catch { /* ignore */ }

    // 日次スナップショット
    let snapMap: Record<string, number> = {};
    try {
      const raw = localStorage.getItem(DAILY_SNAPSHOT_KEY);
      if (raw) snapMap = JSON.parse(raw);
    } catch { /* ignore */ }

    const dateKeys = buildDateKeys(days);
    const lbls = buildLabels(days);

    // 前日の値を引き継ぎながら配列を構築
    const values: number[] = [];
    let last = 0;
    for (const key of dateKeys) {
      if (snapMap[key] !== undefined) {
        last = snapMap[key];
      }
      values.push(last);
    }

    // 間引き（最大8ラベル表示）
    const step = Math.max(1, Math.ceil(days / 8));
    const visibleLabels = lbls.map((l, i) => (i % step === 0 || i === days - 1 ? l : ''));

    return {
      masteredToday: currentMastered,
      labels: visibleLabels,
      masteredData: values,
      remainData: values.map((v) => TOTAL_TAGS - v),
    };
  }, [days]);

  const masteredRate = Math.round((masteredToday / TOTAL_TAGS) * 100);

  const chartData = {
    labels,
    datasets: [
      {
        label: '習得済み',
        data: masteredData,
        backgroundColor: '#1D9E75',
        stack: 'stack',
      },
      {
        label: '未習得',
        data: remainData,
        backgroundColor: '#D3D1C7',
        stack: 'stack',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}タグ`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { maxRotation: 0 },
      },
      y: {
        stacked: true,
        min: 0,
        max: TOTAL_TAGS,
        ticks: { stepSize: 16 },
      },
    },
  } as const;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-lg font-bold mb-3">習得タグ推移（直近{days}日）</h2>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{masteredToday}</p>
          <p className="text-xs text-gray-500 mt-1">習得済みタグ</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gray-600">{TOTAL_TAGS}</p>
          <p className="text-xs text-gray-500 mt-1">出題対象タグ</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{masteredRate}%</p>
          <p className="text-xs text-gray-500 mt-1">習得率</p>
        </div>
      </div>

      {/* カスタム凡例 */}
      <div className="flex gap-4 mb-2 text-sm">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#1D9E75' }} />
          習得済み
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#D3D1C7' }} />
          未習得
        </span>
      </div>

      <Bar data={chartData} options={options} />
    </div>
  );
}
