import { Goal } from '../types';
import { getTodayStr, addDays } from './dateUtils';

export const calculateCoinsForStreak = (streak: number): number => {
  // Base 10 coins per day with a bonus for milestones
  let coins = streak * 10;
  
  // Milestone bonuses
  if (streak >= 7) coins += 50; // 1 week
  if (streak >= 30) coins += 200; // 1 month
  if (streak >= 90) coins += 500; // 3 months
  if (streak >= 180) coins += 1000; // 6 months
  if (streak >= 365) coins += 3000; // 1 year
  
  return coins;
};

export const checkInGoal = (goal: Goal): Goal => {
  const today = getTodayStr();
  
  // If already checked in today, return unchanged
  if (goal.lastCheckIn === today) {
    return goal;
  }
  
  // Calculate new streak
  const newStreak = goal.currentStreak + 1;
  const previousCoins = goal.coinsEarned;
  const newCoins = calculateCoinsForStreak(newStreak);
  const coinsEarned = newCoins - previousCoins;
  
  return {
    ...goal,
    currentStreak: newStreak,
    lastCheckIn: today,
    coinsEarned: newCoins
  };
};

export const pauseGoal = (goal: Goal, pauseDays: number = 1): Goal => {
  if (goal.pausesRemaining <= 0 || goal.isPaused) {
    return goal;
  }
  
  const pausedUntil = addDays(new Date(), pauseDays).toISOString();
  
  return {
    ...goal,
    isPaused: true,
    pausedUntil,
    pauseCount: goal.pauseCount + 1,
    pausesRemaining: goal.pausesRemaining - 1
  };
};

export const resetGoal = (goal: Goal): Goal => {
  return {
    ...goal,
    currentStreak: 0,
    coinsEarned: 0,
    pauseCount: 0,
    pausesRemaining: 3, // Reset available pauses
    lastCheckIn: null,
    isPaused: false,
    pausedUntil: null
  };
};

export const checkPausedGoals = (goals: Goal[]): Goal[] => {
  const now = new Date();
  
  return goals.map(goal => {
    if (goal.isPaused && goal.pausedUntil && new Date(goal.pausedUntil) <= now) {
      return {
        ...goal,
        isPaused: false,
        pausedUntil: null
      };
    }
    return goal;
  });
};

export const shouldShowCheckInReminder = (goals: Goal[]): boolean => {
  const today = getTodayStr();
  return goals.some(goal => 
    !goal.isPaused && 
    goal.lastCheckIn !== today
  );
};