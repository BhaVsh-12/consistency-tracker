import React from 'react';

const ProgressBar = ({
  currentValue,
  maxValue,
  minValue,
  showLabel = true,
  className = '',
  colorClass = 'bg-blue-500',
  animateProgress = true,
  rank
}) => {
 const percentage = Math.min(
  Math.max(0, ((currentValue+1 - minValue) / (maxValue - minValue)) * 100),
  100
);
const bgcolor=rank.color.replace('text-','bg-');
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1">
        {showLabel && (
          <>
            <span className="text-xs font-medium text-gray-500">{currentValue}</span>
            <span className="text-xs font-medium text-gray-500">{maxValue}</span>
          </>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${bgcolor} bg-green-300 ${animateProgress ? 'transition-all duration-1000 ease-out' : ''}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
