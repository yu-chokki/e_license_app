import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import tagsData from '../data/tags.json';
import type { Tag, Progress } from '../types';
import TagSelector from '../components/TagSelector';

const allTags: Tag[] = (tagsData as { tags: Tag[] }).tags;
const eligibleTags = allTags.filter((t) => t.eligible);
const tagMap = new Map(allTags.map((t) => [t.id, t]));

const PROGRESS_KEY = 'eqa_progress';
const LAST_TAG_KEY = 'eqa_last_tag';

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(eligibleTags.map((t) => t.id))
  );

  const progress = useMemo(() => loadProgress(), []);
  const lastTagId = localStorage.getItem(LAST_TAG_KEY);
  const lastTagLabel = lastTagId ? tagMap.get(lastTagId)?.label : null;

  const totalAnswered = Object.values(progress).reduce((s, p) => s + p.total, 0);
  const totalCorrect = Object.values(progress).reduce((s, p) => s + p.correct, 0);
  const overallRate = totalAnswered === 0 ? null : Math.round((totalCorrect / totalAnswered) * 100);

  const startTagMode = () => {
    if (selectedTags.size === 0) return;
    navigate('/quiz', { state: { tagIds: Array.from(selectedTags), mode: 'tag' } });
  };

  const startRandomMode = () => {
    navigate('/quiz', { state: { tagIds: eligibleTags.map((t) => t.id), mode: 'random' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <header className="pt-12 pb-6 px-4 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">E資格学習</h1>
        <p className="text-gray-500 text-sm mt-1">JDLA E資格 シラバス対応</p>
      </header>

      <main className="flex-1 px-4 max-w-lg mx-auto w-full space-y-4 pb-8">
        {!showTagSelector ? (
          <>
            {/* サマリーカード */}
            {totalAnswered > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">学習サマリー</span>
                  {lastTagLabel && (
                    <span className="text-xs text-indigo-500">
                      前回: {lastTagLabel}
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{totalAnswered}</div>
                    <div className="text-xs text-gray-500">総出題数</div>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{overallRate}%</div>
                    <div className="text-xs text-gray-500">全体正解率</div>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-700">
                      {eligibleTags.filter((t) => (progress[t.id]?.total ?? 0) > 0).length}
                    </div>
                    <div className="text-xs text-gray-500">学習済みタグ</div>
                  </div>
                </div>
                {lastTagLabel && (
                  <button
                    onClick={() => {
                      if (lastTagId) navigate('/quiz', { state: { tagIds: [lastTagId], mode: 'tag' } });
                    }}
                    className="mt-3 w-full py-2 text-xs text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    📌 前回の「{lastTagLabel}」を続ける
                  </button>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">学習を始める</h2>

              <button
                onClick={() => setShowTagSelector(true)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-base transition-colors"
              >
                📚 分野を選んで解く
              </button>

              <button
                onClick={startRandomMode}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-base transition-colors"
              >
                🎲 ランダムで解く
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-base border border-gray-200 transition-colors"
              >
                📊 ダッシュボードを見る
              </button>
            </div>

            <div className="text-center text-xs text-gray-400">
              出題対象: {eligibleTags.length} タグ / {320} 問
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">分野を選択</h2>
              <button
                onClick={() => setShowTagSelector(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <TagSelector
              tags={allTags}
              selected={selectedTags}
              onChange={setSelectedTags}
            />

            <button
              onClick={startTagMode}
              disabled={selectedTags.size === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-base transition-colors"
            >
              出題開始（{selectedTags.size} 分野）
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
