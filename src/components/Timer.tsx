import { Play, Pause, X } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/progression';

const Timer = () => {
  const { timer, startTimer, pauseTimer, stopTimer } = useTimer();

  if (timer.timeRemaining === 0 && timer.totalTime === 0) {
    return null;
  }

  const progressPercentage = ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="glass-effect rounded-2xl p-6 shadow-2xl min-w-[280px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-evolve-text">Rest Timer</h3>
          <button
            onClick={stopTimer}
            className="text-evolve-text-muted hover:text-evolve-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Ring */}
        <div className="relative flex items-center justify-center mb-6">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-evolve-light-gray"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                timer.timeRemaining <= 10 ? 'text-red-500' : 'text-evolve-blue'
              }`}
              strokeDasharray={`${progressPercentage * 2.827} 282.7`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${
              timer.timeRemaining <= 10 ? 'text-red-500' : 'text-evolve-text'
            }`}>
              {formatTime(timer.timeRemaining)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={timer.isActive ? pauseTimer : () => startTimer(timer.timeRemaining)}
            className="button-secondary flex items-center gap-2"
          >
            {timer.isActive ? <Pause size={16} /> : <Play size={16} />}
            {timer.isActive ? 'Pause' : 'Resume'}
          </button>
        </div>

        {/* Time completed indicator */}
        {timer.timeRemaining === 0 && (
          <div className="mt-4 text-center">
            <div className="text-evolve-green font-semibold animate-pulse-green">
              Rest Complete! 💪
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;