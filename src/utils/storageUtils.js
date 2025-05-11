
import Api from '../../Api';
const GOALS_KEY = 'daily-tracker-goals';

export const saveGoals = async(goals) => {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  console.log(JSON.stringify(goals));
  
};

export const loadGoals = () => {
  const storedGoals = localStorage.getItem(GOALS_KEY);
  return storedGoals ? JSON.parse(storedGoals) : [];
};

export const getTotalCoins = (goals) => {
  return goals.reduce((total, goal) => total + goal.coinsEarned, 0);
};

export const getTopStreak = (goals) => {
  if (goals.length === 0) return 0;
  return Math.max(...goals.map(goal => goal.currentStreak));
};

export const getHighestRankGoal = (goals) => {
  if (goals.length === 0) return null;

  return goals.reduce((highest, current) => {
    return current.currentStreak > highest.currentStreak ? current : highest;
  }, goals[0]);
};
