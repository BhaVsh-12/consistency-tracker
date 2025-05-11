import React from 'react';
import { 
  Flame, 
  Coins,
  Award,
  BadgeCheck,
  CalendarCheck,
  Target,
  Plus,
  Pause,
  Play,
  RefreshCw,
  Trash2
} from 'lucide-react';

export const StreakFlame = ({ className = '' }) => (
  <Flame className={`text-orange-500 ${className}`} />
);

export const CoinIcon = ({ className = '' }) => (
  <Coins className={`text-yellow-500 ${className}`} />
);

export const AwardIcon = ({ className = '' }) => (
  <Award className={`text-purple-500 ${className}`} />
);

export const BadgeIcon = ({ className = '' }) => (
  <BadgeCheck className={`text-indigo-500 ${className}`} />
);

export const CalendarIcon = ({ className = '' }) => (
  <CalendarCheck className={`text-blue-500 ${className}`} />
);

export const TargetIcon = ({ className = '' }) => (
  <Target className={`text-green-500 ${className}`} />
);

export const AddIcon = ({ className = '' }) => (
  <Plus className={`${className}`} />
);

export const PauseIcon = ({ className = '' }) => (
  <Pause className={`${className}`} />
);

export const PlayIcon = ({ className = '' }) => (
  <Play className={`${className}`} />
);

export const ResetIcon = ({ className = '' }) => (
  <RefreshCw className={`${className}`} />
);

export const DeleteIcon = ({ className = '' }) => (
  <Trash2 className={`${className}`} />
);
