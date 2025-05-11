import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import { useNotifications } from '../context/NotificationContext';
import RankBadge from './RankBadge';
import ProgressBar from './ProgressBar';
import { isToday, formatDate, formatTimeLeft } from '../utils/dateUtils';
import { getRankByDays, getNextRank, getDaysToNextRank } from '../data/ranks';
import { StreakFlame, PauseIcon, PlayIcon, ResetIcon, DeleteIcon } from './Icons';
import CoinDisplay from './CoinDisplay';

const GoalCard = ({ goal }) => {
  const { checkIn, pause, reset, removeGoal, resume } = useGoals();
  const { showNotification } = useNotifications();

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmResume, setShowConfirmResume] = useState(false); // New state for resume confirmation
  const [isResuming, setIsResuming] = useState(false);
  const [pauseDays, setPauseDays] = useState(1);
  const [showPauseOptions, setShowPauseOptions] = useState(false);

  const currentRank = getRankByDays(goal.streak);
  const nextRank = getNextRank(currentRank);
  const daysToNextRank = nextRank ? getDaysToNextRank(goal.streak, currentRank, nextRank) : 0;

  const handleCheckIn = () => {
    if (goal.isPaused) {
      showNotification("Can't check in while goal is paused", "warning");
      return;
    }
    if (isToday(goal.lastCheckIn)) {
      showNotification("Already checked in today!", "info");
      return;
    }
    checkIn(goal._id);
    showNotification("Great job! Streak updated", "success");
  };

  const handlePause = () => {
    if (goal.pausesRemaining <= 0) {
      showNotification("No pauses remaining for this goal", "error");
      return;
    }
    pause(goal._id, pauseDays);
    setShowPauseOptions(false);
    showNotification(`Goal paused for ${pauseDays} day${pauseDays > 1 ? 's' : ''}`, "info");
  };

  const handleInitiateResume = () => {
    setShowConfirmResume(true); // Show the confirmation UI
  };

  const handleConfirmResume = async () => {
    setShowConfirmResume(false); // Hide the confirmation UI
    setIsResuming(true);
    const success = await resume(goal._id);
    setIsResuming(false);
    if (success) {
      showNotification("Goal resumed!", "success");
    } else {
      showNotification("Failed to resume goal.", "error");
    }
  };

  const handleCancelResume = () => {
    setShowConfirmResume(false); // Hide the confirmation UI
  };

  const handleReset = () => {
    reset(goal._id);
    setShowConfirmReset(false);
    showNotification("Goal has been reset", "warning");
  };

  const handleDelete = () => {
    removeGoal(goal._id);
    showNotification("Goal has been deleted", "info");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{goal.title}</h3>
          <RankBadge rank={currentRank} size="sm" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <StreakFlame className="w-5 h-5 " />
          <span className="text-lg font-semibold">{goal.streak} day{goal.streak !== 1 ? 's' : ''}</span>
        </div>

        {nextRank && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Next rank:</span>
              <span className="text-xs font-medium text-gray-600">{nextRank.title} in {daysToNextRank} days</span>
            </div>
            <ProgressBar
              rank={currentRank}
              currentValue={goal.streak}
              minValue={currentRank.minDay}
              maxValue={nextRank.minDay}
              showLabel={false}
              colorClass={currentRank.color.replace('text-', 'bg-')}
            />
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>Started: {formatDate(goal.start)}</div>
          <CoinDisplay coins={goal.coin} size="sm" />
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50">
        {goal.pause ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm text-amber-600 flex items-center gap-1 mb-1">
              <PauseIcon className="w-4 h-4" />
              <span>Paused until: {formatTimeLeft(goal.pausedUntil || '')}</span>
            </div>
            {showConfirmResume ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-blue-600 mb-1">Are you sure you want to resume this goal?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmResume}
                    disabled={isResuming}
                    className={`flex-1 py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded ${
                      isResuming ? 'cursor-wait bg-blue-400' : ''
                    }`}
                  >
                    {isResuming ? 'Resuming...' : 'Yes, Resume'}
                  </button>
                  <button
                    onClick={handleCancelResume}
                    className="flex-1 py-1.5 px-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInitiateResume}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                Resume Now
              </button>
            )}
          </div>
        ) : showPauseOptions ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">Pause for:</span>
              <select
                value={pauseDays}
                onChange={(e) => setPauseDays(Number(e.target.value))}
                className="flex-1 p-1 border border-gray-300 rounded"
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePause}
                className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPauseOptions(false)}
                className="flex-1 py-1.5 px-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showConfirmReset ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-600 mb-1">Reset will lose all progress!</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-1.5 px-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showConfirmDelete ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-600 mb-1">Delete this goal permanently?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-1.5 px-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCheckIn}
              disabled={goal.didCheckInToday || goal.pause}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded flex items-center justify-center gap-1 ${
                goal.didCheckInToday || goal.pause
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {goal.didCheckInToday ? 'Checked ✓' : 'Check In'}
            </button>

            <button
              onClick={() => setShowPauseOptions(true)}
              disabled={goal.pause || goal.pausesRemaining <= 0}
              className={`min-w-[40px] py-2 px-3 rounded flex items-center justify-center ${
                goal.pause || goal.pausesRemaining <= 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
              title={`Pause (${goal.pausesRemaining} remaining)`}
            >
              <PauseIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowConfirmReset(true)}
              className="min-w-[40px] py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center"
              title="Reset Goal"
            >
              <ResetIcon className="w-4 h-4 " />
            </button>

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="min-w-[40px] py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center"
              title="Delete Goal"
            >
              <DeleteIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;