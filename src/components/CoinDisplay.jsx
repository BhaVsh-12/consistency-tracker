import React from 'react';
import { CoinIcon } from './Icons';

const CoinDisplay = ({ coins, size = 'md', showAnimation = false }) => {
  const [displayedCoins, setDisplayedCoins] = React.useState(coins);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    if (coins !== displayedCoins && showAnimation) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayedCoins(coins);
        setAnimating(false);
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setDisplayedCoins(coins);
    }
  }, [coins, displayedCoins, showAnimation]);

  let containerClass = 'flex items-center gap-1 font-medium';
  let iconSize = '';
  let textClass = '';

  switch (size) {
    case 'sm':
      iconSize = 'w-4 h-4';
      textClass = 'text-sm';
      break;
    case 'lg':
      iconSize = 'w-6 h-6';
      textClass = 'text-lg';
      break;
    default:
      iconSize = 'w-5 h-5';
      textClass = 'text-base';
  }

  return (
    <div className={containerClass}>
      <CoinIcon className={`${iconSize} text-yellow-500 ${animating ? 'animate-bounce' : ''}`} />
      <span className={`${textClass} ${animating ? 'text-green-500 transition-colors' : ''}`}>
        {displayedCoins.toLocaleString()}
      </span>
    </div>
  );
};

export default CoinDisplay;
