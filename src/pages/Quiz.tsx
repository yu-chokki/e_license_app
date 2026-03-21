import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import tagsData from '../data/tags.json';
import type { Question, Tag, SessionResult } from '../types';
import QuestionCard from '../components/QuestionCard';
import { useProgress } from '../hooks/useProgress';

const allQuestions: Question[] = (questionsData as { questions: Question[] }).questions;
const allTags: Tag[] = (tagsData as { tags: Tag[] }).tags;
const tagMap = new Map(allTags.map((t) => [t.id, t]));

const LAST_TAG_KEY = 'eqa_last_tag';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordAnswer } = useProgress();

  const { tagIds = [] } = (location.state as { tagIds: string[]; mode: string }) ?? {};

  const queueRef = useRef<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);

  useEffect(() => {
    const filtered = allQuestions.filter((q) => tagIds.includes(q.tagId));
    queueRef.current = shuffle(filtered);
    setCurrentIndex(0);
    setSelectedId(null);
    setSessionResults([]);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const questions = queueRef.current;
  const current = questions[currentIndex];

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">選択した分野に問題がまだありません。</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
        >
          ホームへ戻る
        </button>
      </div>
    );
  }

  const currentTag = tagMap.get(current?.tagId ?? '');
  const tagLabel = currentTag?.label ?? current?.tagId ?? '';

  const handleSelect = (choiceId: string) => {
    setSelectedId(choiceId);
    const correct = choiceId === current.answerId;
    recordAnswer(current.id, current.tagId, correct);
    localStorage.setItem(LAST_TAG_KEY, current.tagId);
    setSessionResults((prev) => [
      ...prev,
      { questionId: current.id, tagId: current.tagId, correct },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      navigate('/result', { state: { sessionResults } });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>問題 {currentIndex + 1} / {questions.length}問</span>
            <span>{sessionResults.filter((r) => r.correct).length} 正解</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((currentIndex + (selectedId ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        {current && (
          <QuestionCard
            question={current}
            tagLabel={tagLabel}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}

        {selectedId && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-base transition-colors"
          >
            {currentIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ →'}
          </button>
        )}
      </main>
    </div>
  );
}
