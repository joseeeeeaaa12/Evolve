import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, Minus, ChevronLeft, Trophy } from 'lucide-react';
import { useAppStore } from '../store';
import { useTimer } from '../hooks/useTimer';


const Workout = () => {
  const navigate = useNavigate();
  const { currentWorkout, completeSet, addSet, updateExerciseWeight, completeWorkout, updatePersonalRecord } = useAppStore();
  const { startTimer } = useTimer();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isCompletingWorkout, setIsCompletingWorkout] = useState(false);
  const [showPRCelebration, setShowPRCelebration] = useState(false);

  useEffect(() => {
    if (!currentWorkout) {
      navigate('/');
    }
  }, [currentWorkout, navigate]);

  if (!currentWorkout) return null;

  const currentExercise = currentWorkout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === currentWorkout.exercises.length - 1;
  const completedSets = currentExercise.sets.filter(set => set.completed).length;
  const allSetsCompleted = completedSets === currentExercise.sets.length;

  const handleCompleteSet = (setId: string, reps: number) => {
    const set = currentExercise.sets.find(s => s.id === setId);
    if (!set) return;

    completeSet(currentExercise.id, setId, set.targetWeight, reps);
    
    // Check for PR
    const isPR = reps >= set.targetReps && set.targetWeight > 0;
    if (isPR) {
      updatePersonalRecord(currentExercise.exerciseId, set.targetWeight, reps);
      setShowPRCelebration(true);
      setTimeout(() => setShowPRCelebration(false), 3000);
    }

    // Auto-start rest timer
    startTimer(currentExercise.restTime, currentExercise.id);
  };

  const handleNextExercise = () => {
    if (isLastExercise) {
      handleCompleteWorkout();
    } else {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleCompleteWorkout = () => {
    setIsCompletingWorkout(true);
    setTimeout(() => {
      completeWorkout();
      navigate('/');
      setIsCompletingWorkout(false);
    }, 1500);
  };

  const adjustWeight = (delta: number) => {
    const newWeight = Math.max(0, currentExercise.targetWeight + delta);
    updateExerciseWeight(currentExercise.id, newWeight);
  };

  const SetRow = ({ set, index }: { set: any; index: number }) => {
    const [reps, setReps] = useState(set.reps || set.targetReps);
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = () => {
      if (set.completed) return;
      setIsCompleting(true);
      setTimeout(() => {
        handleCompleteSet(set.id, reps);
        setIsCompleting(false);
      }, 500);
    };

    return (
      <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
        set.completed 
          ? 'bg-evolve-green/20 border-2 border-evolve-green/30' 
          : 'bg-evolve-light-gray border-2 border-transparent'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            set.completed 
              ? 'bg-evolve-green text-evolve-dark' 
              : 'bg-evolve-gray text-evolve-text-muted'
          }`}>
            {set.completed ? <Check size={16} /> : index + 1}
          </div>
          
          <div className="text-center">
            <div className="text-evolve-text-muted text-sm">Weight</div>
            <div className="text-xl font-bold text-evolve-text">
              {set.targetWeight} lbs
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!set.completed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReps(Math.max(0, reps - 1))}
                className="w-8 h-8 bg-evolve-gray rounded-full flex items-center justify-center text-evolve-text hover:bg-evolve-light-gray transition-colors"
              >
                <Minus size={16} />
              </button>
              
              <div className="text-center min-w-[60px]">
                <div className="text-evolve-text-muted text-sm">Reps</div>
                <div className="text-2xl font-bold text-evolve-text">
                  {reps}
                </div>
              </div>
              
              <button
                onClick={() => setReps(reps + 1)}
                className="w-8 h-8 bg-evolve-gray rounded-full flex items-center justify-center text-evolve-text hover:bg-evolve-light-gray transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          {set.completed ? (
            <div className="text-center">
              <div className="text-evolve-text-muted text-sm">Completed</div>
              <div className="text-xl font-bold text-evolve-green">
                {set.reps} reps
              </div>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleting || reps === 0}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                isCompleting
                  ? 'bg-evolve-green/50 text-evolve-dark cursor-not-allowed'
                  : reps === 0
                  ? 'bg-evolve-light-gray text-evolve-text-muted cursor-not-allowed'
                  : 'bg-evolve-blue text-evolve-dark hover:bg-evolve-blue/90 active:scale-95'
              }`}
            >
              {isCompleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-evolve-dark border-t-transparent rounded-full animate-spin"></div>
                  Done
                </div>
              ) : (
                'Complete'
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-evolve-dark pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-effect border-b border-evolve-light-gray/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-evolve-text-muted hover:text-evolve-text transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Exit</span>
          </button>
          
          <div className="text-center">
            <div className="text-lg font-bold text-evolve-text">{currentWorkout.name}</div>
            <div className="text-evolve-text-muted text-sm">
              Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}
            </div>
          </div>

          <div className="text-evolve-text-muted text-sm">
            {completedSets}/{currentExercise.sets.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-evolve-light-gray rounded-full h-2">
          <div 
            className="bg-evolve-blue h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentExerciseIndex + (completedSets / currentExercise.sets.length)) / currentWorkout.exercises.length) * 100}%` 
            }}
          />
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Exercise Info */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-evolve-text">
            {currentExercise.exercise.name}
          </h1>
          <p className="text-evolve-text-muted">
            {currentExercise.exercise.description}
          </p>
        </div>

        {/* Weight Adjustment */}
        <div className="card space-y-4">
          <div className="text-center">
            <div className="text-evolve-text-muted text-sm mb-2">Working Weight</div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => adjustWeight(-5)}
                className="w-12 h-12 bg-evolve-light-gray rounded-full flex items-center justify-center text-evolve-text hover:bg-evolve-light-gray/80 transition-colors"
              >
                <Minus size={20} />
              </button>
              
              <div className="text-4xl font-bold text-evolve-blue min-w-[120px]">
                {currentExercise.targetWeight} lbs
              </div>
              
              <button
                onClick={() => adjustWeight(5)}
                className="w-12 h-12 bg-evolve-light-gray rounded-full flex items-center justify-center text-evolve-text hover:bg-evolve-light-gray/80 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-evolve-text">Sets</h3>
            <button
              onClick={() => addSet(currentExercise.id)}
              className="flex items-center gap-2 text-evolve-blue hover:text-evolve-blue/80 transition-colors"
            >
              <Plus size={16} />
              Add Set
            </button>
          </div>

          <div className="space-y-3">
            {currentExercise.sets.map((set, index) => (
              <SetRow key={set.id} set={set} index={index} />
            ))}
          </div>
        </div>

        {/* Next Exercise / Complete Workout */}
        {allSetsCompleted && (
          <div className="card text-center space-y-4 animate-slide-up">
            <div className="text-evolve-green font-semibold">
              Great work! 💪
            </div>
            
            <button
              onClick={handleNextExercise}
              disabled={isCompletingWorkout}
              className={`w-full flex items-center justify-center gap-3 text-lg ${
                isCompletingWorkout 
                  ? 'bg-evolve-light-gray text-evolve-text-muted cursor-not-allowed' 
                  : 'button-primary'
              } px-6 py-4 rounded-xl transition-all duration-200`}
            >
              {isCompletingWorkout ? (
                <>
                  <div className="w-5 h-5 border-2 border-evolve-text-muted border-t-transparent rounded-full animate-spin"></div>
                  Completing Workout...
                </>
              ) : isLastExercise ? (
                <>
                  <Trophy size={20} />
                  Complete Workout
                </>
              ) : (
                <>
                  Next Exercise: {currentWorkout.exercises[currentExerciseIndex + 1]?.exercise.name}
                  <ChevronLeft size={20} className="rotate-180" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* PR Celebration */}
      {showPRCelebration && (
        <div className="fixed inset-0 bg-evolve-dark/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="card text-center space-y-4 max-w-sm mx-6 animate-slide-up">
            <div className="text-6xl">🏆</div>
            <div className="text-2xl font-bold text-gradient">Personal Record!</div>
            <div className="text-evolve-text-muted">
              You just hit a new PR on {currentExercise.exercise.name}!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;