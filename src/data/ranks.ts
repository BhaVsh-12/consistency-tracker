import { Rank } from '../types';

export const ranks: Rank[] = [
  { 
    title: "Mortal", 
    minDay: 1, 
    maxDay: 6,
    icon: "star",
    color: "text-green-300"
  },
  { 
    title: "Soldier", 
    minDay: 7, 
    maxDay: 13,
    icon: "shield",
    color: "text-blue-500"
  },
  { 
    title: "Warrior", 
    minDay: 14, 
    maxDay: 29,
    icon: "sword",
    color: "text-indigo-500"
  },
  { 
    title: "Champion", 
    minDay: 30, 
    maxDay: 59,
    icon: "trophy",
    color: "text-purple-500"
  },
  { 
    title: "Veteran", 
    minDay: 60, 
    maxDay: 89,
    icon: "medal",
    color: "text-yellow-500"
  },
  { 
    title: "Master", 
    minDay: 90, 
    maxDay: 179,
    icon: "award",
    color: "text-orange-500"
  },
  { 
    title: "Grandmaster", 
    minDay: 180, 
    maxDay: 364,
    icon: "crown",
    color: "text-rose-500"
  },
  { 
    title: "Legend", 
    minDay: 365, 
    maxDay: 729,
    icon: "flame",
    color: "text-red-500"
  },
  { 
    title: "Primordial", 
    minDay: 730, 
    maxDay: null,
    icon: "diamond",
    color: "text-emerald-500"
  }
];

export const getRankByDays = (days: number): Rank => {
  return ranks.find(rank => 
    days >= rank.minDay && (rank.maxDay === null || days <= rank.maxDay)
  ) || ranks[0];
};

export const getNextRank = (currentRank: Rank): Rank | null => {
  const currentIndex = ranks.findIndex(rank => rank.title === currentRank.title);
  return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
};

export const getDaysToNextRank = (days: number, currentRank: Rank, nextRank: Rank | null): number => {
  if (!nextRank) return 0;
  return nextRank.minDay - days;
};