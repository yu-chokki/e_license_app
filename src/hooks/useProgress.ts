import { useState, useCallback } from 'react';
import type { Progress, QuestionProgress } from '../types';

const PROGRESS_KEY = 'eqa_progress';
const QUESTION_PROGRESS_KEY = 'eqa_question_progress';

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

function loadQuestionProgress(): QuestionProgress {
  try {
    const raw = localStorage.getItem(QUESTION_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as QuestionProgress) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [questionProgress, setQuestionProgress] = useState<QuestionProgress>(loadQuestionProgress);

  const recordAnswer = useCallback(
    (questionId: string, tagId: string, correct: boolean) => {
      setProgress((prev) => {
        const entry = prev[tagId] ?? { total: 0, correct: 0 };
        const next: Progress = {
          ...prev,
          [tagId]: {
            total: entry.total + 1,
            correct: entry.correct + (correct ? 1 : 0),
          },
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
        return next;
      });

      setQuestionProgress((prev) => {
        const entry = prev[questionId] ?? { total: 0, correct: 0 };
        const next: QuestionProgress = {
          ...prev,
          [questionId]: {
            total: entry.total + 1,
            correct: entry.correct + (correct ? 1 : 0),
          },
        };
        localStorage.setItem(QUESTION_PROGRESS_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(QUESTION_PROGRESS_KEY);
    setProgress({});
    setQuestionProgress({});
  }, []);

  return { progress, questionProgress, recordAnswer, resetProgress };
}
