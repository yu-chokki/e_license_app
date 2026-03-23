export type Tag = {
  id: string;
  label: string;
  eligible: boolean;
  ancestors: string[];
  keywords: string[];
};

export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  tagId: string;
  question: string;
  choices: Choice[];
  answerId: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
};

export type TagProgress = {
  total: number;
  correct: number;
};

export type Progress = {
  [tagId: string]: TagProgress;
};

export type QuestionProgress = {
  [questionId: string]: TagProgress;
};

export type SessionResult = {
  questionId: string;
  tagId: string;
  correct: boolean;
  chosenId: string;
};
