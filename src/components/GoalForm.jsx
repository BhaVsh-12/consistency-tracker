import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import { useNotifications } from '../context/NotificationContext';
import { AddIcon } from './Icons';

const GoalForm = () => {
  const [goalName, setGoalName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { addGoal } = useGoals();
  const { showNotification } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!goalName.trim()) {
      showNotification('Please enter a goal name', 'warning');
      return;
    }

    addGoal(goalName.trim());
    setGoalName('');
    setIsOpen(false);
    showNotification('New goal added', 'success');
  };

  return (
    <div className="mb-6">
      {isOpen ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              id="goalName"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g., Daily Meditation"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex-1"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 border-dashed flex items-center justify-center gap-2 transition-colors"
        >
          <AddIcon className="w-5 h-5" />
          <span>Add New Goal</span>
        </button>
      )}
    </div>
  );
};

export default GoalForm;
