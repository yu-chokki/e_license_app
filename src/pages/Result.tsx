import { useLocation, useNavigate } from 'react-router-dom';
import type { SessionResult } from '../types';
import tagsData from '../data/tags.json';
import type { Tag } from '../types';
import ProgressBar from '../components/ProgressBar';

const allTags: Tag[] = (tagsData as { tags: Tag[] }).tags;

type TagSummary = {
  tagId: string;
  label: string;
  correct: number;
  total: number;
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionResults = [] } = (location.state as { sessionResults: SessionResult[] }) ?? {};

  const totalCorrect = sessionResults.filter((r) => r.correct).length;
  const total = sessionResults.length;
  const rate = total === 0 ? 0 : Math.round((totalCorrect / total) * 100);

  // タグ別集計
  const tagMap = new Map<string, TagSummary>();
  sessionResults.forEach((r) => {
    const tag = allTags.find((t) => t.id === r.tagId);
    const existing = tagMap.get(r.tagId) ?? {
      tagId: r.tagId,
      label: tag?.label ?? r.tagId,
      correct: 0,
      total: 0,
    };
    tagMap.set(r.tagId, {
      ...existing,
      total: existing.total + 1,
      correct: existing.correct + (r.correct ? 1 : 0),
    });
  });
  const tagSummaries = Array.from(tagMap.values()).sort(
    (a, b) => a.correct / a.total - b.correct / b.total
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-4 py-3 text-center">
        <h1 className="text-lg font-bold">セッション結果</h1>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        {/* スコアカード */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="text-5xl font-bold text-indigo-600 mb-1">{rate}%</div>
          <div className="text-gray-500 text-sm">
            {total} 問中 {totalCorrect} 問正解
          </div>
        </div>

        {/* タグ別結果 */}
        {tagSummaries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
            <h2 className="text-sm font-semibold">分野別結果</h2>
            {tagSummaries.map((s) => (
              <div key={s.tagId} className="space-y-1">
                <div className="text-xs text-gray-600">{s.label}</div>
                <ProgressBar correct={s.correct} total={s.total} />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-base transition-colors"
        >
          ホームへ戻る
        </button>
      </main>
    </div>
  );
}
