import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../context/GoalContext';
import { useNotifications } from '../context/NotificationContext';
import { StreakFlame, CoinIcon, BadgeIcon } from './Icons';
import { getHighestRankGoal } from '../utils/storageUtils';
import { getRankByDays } from '../data/ranks';

const Header = () => {
  const { goals, topStreak, totalCoins ,global} = useGoals();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const highestRankGoal = getHighestRankGoal(goals);
  const highestRank = highestRankGoal 
    ? getRankByDays(highestRankGoal.currentStreak) 
    : null;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.clear();
    showNotification('Successfully logged out', 'success');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Consistency Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <StreakFlame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-medium">Top Streak</span>
            </div>
            <span className="text-xl font-bold">{global.topstreak}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <CoinIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium">Total Coins</span>
            </div>
            <span className="text-xl font-bold">{global.coins}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <BadgeIcon className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium">Top Rank</span>
            </div>
            <span className="text-xl font-bold">
              {global.toprank}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
