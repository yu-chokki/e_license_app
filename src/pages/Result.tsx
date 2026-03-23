import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SessionResult, Question } from '../types';
import tagsData from '../data/tags.json';
import type { Tag } from '../types';
import questionsData from '../data/questions.json';
import ProgressBar from '../components/ProgressBar';
import NeuroPassLogo from '../components/NeuroPassLogo';

const allTags: Tag[] = (tagsData as { tags: Tag[] }).tags;
const allQuestionsData: Question[] = (questionsData as { questions: Question[] }).questions;
const allQuestionsMap = new Map(allQuestionsData.map((q) => [q.id, q]));

type TagSummary = {
  tagId: string;
  label: string;
  correct: number;
  total: number;
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviewOpen, setReviewOpen] = useState(false);
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
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <NeuroPassLogo variant="mini" />
        <h1 className="text-sm font-semibold text-gray-500">セッション結果</h1>
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

        {/* 解答レビュー */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <button
            onClick={() => setReviewOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-700">📝 解答を振り返る</span>
            <span className="text-gray-400 text-sm">{reviewOpen ? '▲' : '▼'}</span>
          </button>

          {reviewOpen && (
            <div className="divide-y border-t">
              {sessionResults.map((result, i) => {
                const q = allQuestionsMap.get(result.questionId);
                if (!q) return null;
                const tagLabel = allTags.find((t) => t.id === result.tagId)?.label ?? result.tagId;
                const chosenChoice = q.choices.find((c) => c.id === result.chosenId);
                const correctChoice = q.choices.find((c) => c.id === q.answerId);

                return (
                  <div key={result.questionId} className="p-4 space-y-2">
                    {/* 質問ヘッダー */}
                    <div className="flex items-start gap-2">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                          result.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {result.correct ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-0.5">Q{i + 1}・{tagLabel}</p>
                        <p className="text-sm font-medium text-gray-800">{q.question}</p>
                      </div>
                    </div>

                    {/* 自分の解答 */}
                    <div
                      className={`text-xs rounded-lg px-3 py-2 ${
                        result.correct
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <span className="font-semibold">あなたの解答：</span>{chosenChoice?.text ?? '-'}
                    </div>

                    {/* 正解（不正解の場合のみ） */}
                    {!result.correct && (
                      <div className="text-xs rounded-lg px-3 py-2 bg-green-50 text-green-700">
                        <span className="font-semibold">正解：</span>{correctChoice?.text ?? '-'}
                      </div>
                    )}

                    {/* 解説 */}
                    <div className="text-xs text-indigo-800 bg-indigo-50 rounded-lg px-3 py-2 leading-relaxed">
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
