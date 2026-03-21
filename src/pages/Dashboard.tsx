import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tagsData from '../data/tags.json';
import type { Tag } from '../types';
import { useProgress } from '../hooks/useProgress';
import ProgressBar from '../components/ProgressBar';
import MasteredTagsChart from '../components/MasteredTagsChart';
import NeuroPassLogo from '../components/NeuroPassLogo';

const allTags: Tag[] = (tagsData as { tags: Tag[] }).tags;
const eligibleTags = allTags.filter((t) => t.eligible);

// 大分野 → 中分野 → タグ のグルーピング
type GroupedTags = { [domain: string]: { [subdomain: string]: Tag[] } };

const groupedTags = eligibleTags.reduce<GroupedTags>((acc, tag) => {
  const domain = tag.ancestors[0];
  const subdomain = tag.ancestors[1];
  if (!acc[domain]) acc[domain] = {};
  if (!acc[domain][subdomain]) acc[domain][subdomain] = [];
  acc[domain][subdomain].push(tag);
  return acc;
}, {});

const topCategories = Object.keys(groupedTags);

// 全中分野キー（初期展開用）
const allSubKeys = eligibleTags.map((t) => `${t.ancestors[0]}::${t.ancestors[1]}`);

type SortMode = 'default' | 'weakest';

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress, resetProgress } = useProgress();
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(topCategories));
  const [expandedSub, setExpandedSub] = useState<Set<string>>(new Set(allSubKeys));
  const [unlearnedOpen, setUnlearnedOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
      return next;
    });
  };

  const toggleSub = (key: string) => {
    setExpandedSub((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  const getRate = (tagId: string) => {
    const p = progress[tagId];
    if (!p || p.total === 0) return -1;
    return p.correct / p.total;
  };

  const sortedTags = (tags: Tag[]) => {
    if (sortMode === 'weakest') {
      return [...tags].sort((a, b) => getRate(a.id) - getRate(b.id));
    }
    return tags;
  };

  const totalAnswered = eligibleTags.filter((t) => (progress[t.id]?.total ?? 0) > 0).length;
  const totalTags = eligibleTags.length;

  // 未学習タグ
  const unlearned = eligibleTags.filter((t) => (progress[t.id]?.total ?? 0) === 0);
  // 要復習タグ（50%以下かつ1問以上）
  const needReview = eligibleTags.filter((t) => {
    const p = progress[t.id];
    return p && p.total > 0 && p.correct / p.total <= 0.5;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1">
          <NeuroPassLogo variant="mini" />
        </div>
        <button
          onClick={() => {
            if (confirm('進捗をリセットしますか？')) resetProgress();
          }}
          className="text-xs text-red-400 hover:text-red-600"
        >
          リセット
        </button>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4 pb-8">
        <MasteredTagsChart days={30} />
        {/* サマリー */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex gap-4">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-indigo-600">{totalAnswered}</div>
            <div className="text-xs text-gray-500">学習済みタグ</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-700">{totalTags}</div>
            <div className="text-xs text-gray-500">総タグ数</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {Object.values(progress).reduce((s, p) => s + p.total, 0)}
            </div>
            <div className="text-xs text-gray-500">総出題数</div>
          </div>
        </div>

        {/* 要復習セクション */}
        {needReview.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold text-sm">⚠ 要復習 ({needReview.length})</span>
              <span className="text-xs text-red-400">正解率50%以下</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {needReview.map((tag) => {
                const p = progress[tag.id];
                const rate = Math.round((p.correct / p.total) * 100);
                return (
                  <span key={tag.id} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {tag.label} {rate}%
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 未学習タグセクション */}
        {unlearned.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setUnlearnedOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100"
            >
              <span className="text-sm font-semibold text-gray-600">
                未学習タグ ({unlearned.length})
              </span>
              <span className="text-gray-400 text-xs">{unlearnedOpen ? '▲' : '▼'}</span>
            </button>
            {unlearnedOpen && (
              <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                {unlearned.map((tag) => (
                  <span key={tag.id} className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ソートボタン */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortMode('default')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              sortMode === 'default'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            デフォルト順
          </button>
          <button
            onClick={() => setSortMode('weakest')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              sortMode === 'weakest'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            正解率が低い順
          </button>
        </div>

        {/* タグ一覧 (大分野 > 中分野 > タグ) */}
        {topCategories.map((domain) => {
          const subdomains = groupedTags[domain];
          const domainTags = Object.values(subdomains).flat();
          const domainTotal = domainTags.reduce((s, t) => s + (progress[t.id]?.total ?? 0), 0);
          const domainCorrect = domainTags.reduce((s, t) => s + (progress[t.id]?.correct ?? 0), 0);

          return (
            <div key={domain} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* 大分野ヘッダー */}
              <button
                onClick={() => toggleCategory(domain)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50"
              >
                <span className="text-gray-400 mt-0.5">{expanded.has(domain) ? '▼' : '▶'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800">{domain}</div>
                  <div className="mt-1.5">
                    <ProgressBar correct={domainCorrect} total={domainTotal} />
                  </div>
                </div>
              </button>

              {/* 中分野 */}
              {expanded.has(domain) && (
                <div className="border-t">
                  {Object.entries(subdomains).map(([subdomain, tags]) => {
                    const subKey = `${domain}::${subdomain}`;
                    const subTotal = tags.reduce((s, t) => s + (progress[t.id]?.total ?? 0), 0);
                    const subCorrect = tags.reduce((s, t) => s + (progress[t.id]?.correct ?? 0), 0);

                    return (
                      <div key={subdomain} className="border-b last:border-b-0">
                        {/* 中分野ヘッダー */}
                        <button
                          onClick={() => toggleSub(subKey)}
                          className="w-full flex items-start gap-2 px-4 py-2.5 text-left bg-gray-50 hover:bg-gray-100"
                        >
                          <span className="text-gray-400 text-xs mt-0.5">
                            {expandedSub.has(subKey) ? '▼' : '▶'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-600">{subdomain}</div>
                            <div className="mt-1">
                              <ProgressBar correct={subCorrect} total={subTotal} />
                            </div>
                          </div>
                        </button>

                        {/* タグ行 */}
                        {expandedSub.has(subKey) && (
                          <div className="divide-y">
                            {sortedTags(tags).map((tag) => {
                              const p = progress[tag.id];
                              return (
                                <div key={tag.id} className="px-6 py-2.5 space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-gray-700 flex-1">{tag.label}</span>
                                    {p?.total > 0 ? (
                                      <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {p.correct}/{p.total}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-300">未学習</span>
                                    )}
                                  </div>
                                  <ProgressBar correct={p?.correct ?? 0} total={p?.total ?? 0} showCount={false} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
