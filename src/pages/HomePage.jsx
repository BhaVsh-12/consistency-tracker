import React from 'react';
import Header from '../components/Header';
import MotivationalQuote from '../components/MotivationalQuote';
import GoalForm from '../components/GoalForm';
import GoalCard from '../components/GoalCard';
import { useGoals } from '../context/GoalContext';

const HomePage = () => {
  const { goals } = useGoals();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <MotivationalQuote className="mb-6" />

        <GoalForm />

        {goals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-2">No goals yet</h2>
            <p className="text-gray-500">
              Add your first goal to start tracking your consistency!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          Consistency Tracker © {new Date().getFullYear()} - Track your daily goals and build better habits
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
