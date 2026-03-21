type Props = {
  correct: number;
  total: number;
  showCount?: boolean;
};

export default function ProgressBar({ correct, total, showCount = true }: Props) {
  const rate = total === 0 ? 0 : Math.round((correct / total) * 100);
  const color =
    total === 0
      ? 'bg-gray-300'
      : rate >= 80
      ? 'bg-green-500'
      : rate >= 50
      ? 'bg-yellow-400'
      : 'bg-red-400';

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {total === 0 ? '未学習' : `${correct}/${total} (${rate}%)`}
        </span>
      )}
    </div>
  );
}
