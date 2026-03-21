import { useState, useCallback } from 'react';
import type { Progress, QuestionProgress, TagProgress } from '../types';

const PROGRESS_KEY = 'eqa_progress';
const QUESTION_PROGRESS_KEY = 'eqa_question_progress';
const DAILY_SNAPSHOT_KEY = 'eqa_daily_snapshot';

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

export function isMastered(p: TagProgress | undefined): boolean {
  if (!p) return false;
  return p.total >= 3 && p.correct / p.total >= 0.8;
}

function saveDailySnapshot(progress: Progress): void {
  const masteredCount = Object.values(progress).filter(isMastered).length;
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(DAILY_SNAPSHOT_KEY);
    const snapshots: Record<string, number> = raw ? JSON.parse(raw) : {};
    snapshots[today] = masteredCount;
    localStorage.setItem(DAILY_SNAPSHOT_KEY, JSON.stringify(snapshots));
  } catch {
    // localStorageへの書き込み失敗は無視
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
        saveDailySnapshot(next);
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
    localStorage.removeItem(DAILY_SNAPSHOT_KEY);
    setProgress({});
    setQuestionProgress({});
  }, []);

  return { progress, questionProgress, recordAnswer, resetProgress };
}
