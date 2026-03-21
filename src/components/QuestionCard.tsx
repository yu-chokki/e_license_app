import { useState, useEffect } from 'react';
import type { Question, Choice } from '../types';

type Props = {
  question: Question;
  tagLabel: string;
  selectedId: string | null;
  onSelect: (choiceId: string) => void;
};

const LABELS = ['A', 'B', 'C', 'D'];

function Stars({ n }: { n: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {'⭐'.repeat(n)}
      <span className="text-gray-300">{'⭐'.repeat(3 - n)}</span>
    </span>
  );
}

export default function QuestionCard({ question, tagLabel, selectedId, onSelect }: Props) {
  const answered = selectedId !== null;
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);

  useEffect(() => {
    const shuffled = [...question.choices].sort(() => Math.random() - 0.5);
    setShuffledChoices(shuffled);
  }, [question.id]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
          {tagLabel}
        </span>
        <Stars n={question.difficulty} />
      </div>

      <p className="text-base font-medium text-gray-800 leading-relaxed">
        {question.question}
      </p>

      <div className="space-y-2">
        {shuffledChoices.map((choice, i) => {
          const isCorrect = choice.id === question.answerId;
          const isSelected = choice.id === selectedId;

          let btnClass =
            'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ';

          if (!answered) {
            btnClass += 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer';
          } else if (isCorrect) {
            btnClass += 'border-green-500 bg-green-50 text-green-800 font-semibold';
          } else if (isSelected) {
            btnClass += 'border-red-400 bg-red-50 text-red-700';
          } else {
            btnClass += 'border-gray-200 bg-gray-50 text-gray-400 cursor-default';
          }

          return (
            <button
              key={choice.id}
              className={btnClass}
              onClick={() => !answered && onSelect(choice.id)}
              disabled={answered}
            >
              <span className="font-semibold mr-2">{LABELS[i]}.</span>
              {choice.text}
              {answered && isCorrect && <span className="ml-2">✓</span>}
              {answered && isSelected && !isCorrect && <span className="ml-2">✗</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-900 leading-relaxed">
          <span className="font-semibold">解説：</span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
