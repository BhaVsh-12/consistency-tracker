export interface Goal {
  id: string;
  name: string;
  startDate: string;
  currentStreak: number;
  pauseCount: number; 
  pausesRemaining: number;
  restDays: number[];
  coinsEarned: number;
  lastCheckIn: string | null;
  isPaused: boolean;
  pausedUntil: string | null;
}

export interface Rank {
  title: string;
  minDay: number;
  maxDay: number | null;
  icon: string;
  color: string;
}

export interface Quote {
  text: string;
  author: string;
}