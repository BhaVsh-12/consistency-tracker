import React, { createContext, useContext, useState, useEffect } from 'react';
import Api from '../../Api';
import { useAuth } from './AuthContext';

const GoalContext = createContext({
  goals: [],
  global:{},
  addGoal: (title) => Promise.resolve(),
  checkIn: (goalId) => Promise.resolve(),
  pause: (goalId, days) => Promise.resolve(),
  resume:(goalId)=>Promise.resolve(),
  reset: (goalId) => Promise.resolve(),
  removeGoal: (goalId) => Promise.resolve(),
  totalCoins: 0,
  topStreak: 0,
  fetchGoals: () => Promise.resolve(),
  fetchGlobal: () => Promise.resolve(),
});

export const useGoals = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const { authToken } = useAuth();
  const [global, setGlobal] = useState({});

  const fetchGoals = async () => {
    if (authToken) {
      try {
        const response = await Api.get('/user/api/auth/goals', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.status >= 200 && response.status < 300) {
          setGoals(response.data.goals);
        } else {
          console.error('Error fetching goals:', response.data);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [authToken]);
  const fetchGlobal = async () => {
    if (authToken) {
      try {
        const response = await Api.get('/user/api/auth/global', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
if (response.status >= 200 && response.status < 300) {
          setGlobal(response.data.global);
        } else {
          console.error('Error fetching goals:', response.data);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    }
  };

  const addGoal = async (title) => {
    if (authToken) {
      try {
        const response = await Api.put(
          '/user/api/auth/addgoal',
          { title },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          setGoals(response.data.goals);
        } else {
          console.error('Error adding goal:', response.data);
        }
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    } else {
      console.warn('Not authenticated. Cannot add goal to backend.');
    }
  };

  const checkIn = async (goalId) => {
    if (authToken) {
      try {
        const response = await Api.put(
          '/user/api/auth/checkin',
          { goalId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          setGoals((prevGoals) =>
            prevGoals.map((goal) => (goal._id === goalId ? response.data.goal : goal))
          );
        } else {
          console.error('Error checking in goal:', response.data);
        }
      } catch (error) {
        console.error('Error checking in goal:', error);
      }
    } else {
      console.warn('Not authenticated. Cannot check in goal on backend.');
    }
  };

  const reset = async (goalId) => {
    if (authToken) {
      try {
        const response = await Api.put(
          '/user/api/auth/resetstreak',
          { goalId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          setGoals((prevGoals) =>
            prevGoals.map((goal) => (goal._id === goalId ? response.data.goal : goal))
          );
        } else {
          console.error('Error resetting streak:', response.data);
        }
      } catch (error) {
        console.error('Error resetting streak:', error);
      }
    } else {
      console.warn('Not authenticated. Cannot reset streak on backend.');
    }
  };

  const removeGoal = async (goalId) => {
    if (authToken) {
      try {
        const response = await Api.delete('/user/api/auth/deletegoal', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: { goalId },
        });
        if (response.status >= 200 && response.status < 300) {
          setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
        } else {
          console.error('Error deleting goal:', response.data);
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    } else {
      console.warn('Not authenticated. Cannot delete goal on backend.');
    }
  };

  const pause = async (goalId, days) => {
    if (authToken) {
      try {
        const response = await Api.put(
          '/user/api/auth/pausegoal',
          { goalId, day: days },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          setGoals((prevGoals) =>
            prevGoals.map((goal) => (goal._id === goalId ? response.data.goal : goal))
          );
        } else {
          console.error('Error pausing goal:', response.data);
        }
      } catch (error) {
        console.error('Error pausing goal:', error);
      }
    } else {
      console.warn('Not authenticated. Cannot pause goal on backend.');
    }
  };
  const resume = async (goalId) => {
    if (authToken) {
      try {
        const response = await Api.put(
          '/user/api/auth/resumegoal',
          {goalId},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          setGoals((prevGoals) =>
            prevGoals.map((goal) => (goal._id === goalId ? response.data.goal : goal))
          );
          return true;
        } else {
          console.error('Error resuming goal:', response.data);
          return false;
        }
      } catch (error) {
        console.error('Error resuming goal:', error);
        return false;
      }
    } else {
      console.warn('Not authenticated. Cannot resume goal on backend.');
      return false;
    }
  };
  useEffect(() => {
    fetchGlobal();
  }, [authToken,resume,pause,checkIn]);
  const totalCoins = goals.reduce((sum, goal) => sum + (goal.coin || 0), 0);
  const topStreak = goals.length > 0 ? Math.max(...goals.map((goal) => goal.streak || 0)) : 0;

  return (
    <GoalContext.Provider
      value={{
        goals,
        global,
        addGoal,
        checkIn,
        pause,
        reset,
        removeGoal,
        totalCoins,
        topStreak,
        fetchGoals,
        resume,
         fetchGlobal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};