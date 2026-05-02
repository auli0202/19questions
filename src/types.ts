export interface Word {
  sn: string;
  question: string;
  answer: string;
  mainCategory: string;
  subCategory: string;
  category: string;
  importance: number;
  proverbEn: string;
  proverbBn: string;
}

export type WordStatus = 'new' | 'mastered' | 'review';

export interface ProgressData {
  [wordId: string]: WordStatus;
}

export interface DailyLog {
  [date: string]: string[]; // Array of word IDs (questions)
}

export interface SRSData {
  [wordId: string]: {
    interval: number;
    ease: number;
    next: number; // timestamp
  };
}
