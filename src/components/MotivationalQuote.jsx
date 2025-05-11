import React, { useEffect, useState } from 'react';
import { getDailyQuote } from '../data/quotes';

const MotivationalQuote = ({ className = '' }) => {
  const [quote, setQuote] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setQuote(getDailyQuote());
      setFadeIn(true);
    }, 300);
  }, []);

  if (!quote) {
    return <div className={`h-24 ${className}`}></div>;
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm ${className} ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <blockquote className="relative">
        <span className="absolute top-0 left-0 text-4xl text-blue-200">"</span>
        <p className="text-gray-700 italic text-lg font-light pl-6 pt-2">
          {quote.text}
        </p>
        <footer className="mt-2 text-right text-gray-500">
          — <cite>{quote.author}</cite>
        </footer>
      </blockquote>
    </div>
  );
};

export default MotivationalQuote;
