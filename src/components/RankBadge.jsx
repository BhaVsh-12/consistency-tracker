import React from "react";
import {
  Shield,
  Star,
  Sword,
  Trophy,
  Medal,
  Award,
  Crown,
  Flame,
  Diamond,
  Zap,
  Skull,
  Mountain,
} from "lucide-react";

const RankBadge = ({ rank, size = "md", showTitle = true }) => {
  let containerClass = "flex items-center gap-1 rounded-full";
  let iconClass = "";
  let textClass = "font-medium";

  switch (size) {
    case "sm":
      containerClass += " px-2 py-1";
      iconClass = "w-3 h-3";
      textClass += " text-xs";
      break;
    case "lg":
      containerClass += " px-4 py-2";
      iconClass = "w-6 h-6";
      textClass += " text-base";
      break;
    default:
      containerClass += " px-3 py-1.5";
      iconClass = "w-4 h-4";
      textClass += " text-sm";
  }

  const getIcon = () => {
    switch (rank.icon) {
      case "star":
        return <Star className={iconClass} />;
      case "shield":
        return <Shield className={iconClass} />;
      case "sword":
        return <Sword className={iconClass} />;
      case "trophy":
        return <Trophy className={iconClass} />;
      case "medal":
        return <Medal className={iconClass} />;
      case "award":
        return <Award className={iconClass} />;
      case "crown":
        return <Crown className={iconClass} />;
      case "flame":
        return <Flame className={iconClass} />;
      case "diamond":
        return <Diamond className={iconClass} />;
      case "zap":
        return <Zap className={iconClass} />;
      case "skull":
        return <Skull className={iconClass} />;
      case "mountain":
        return <Mountain className={iconClass} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  return (
    <div className={`${containerClass} bg-gray-100`}>
      <span className={rank.color}>{getIcon()}</span>
      {showTitle && (
        <span className={`${textClass} ${rank.color}`}>{rank.title}</span>
      )}
    </div>
  );
};

export default RankBadge;
