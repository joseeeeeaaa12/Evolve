import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Info, Zap } from 'lucide-react';
import { useAppStore } from '../store';
import { generateFoundationWorkout } from '../utils/progression';

interface ExerciseResult {
  exerciseId: string;
  weight: number;
  reps: number;
}

const Foundation = () => {
  const navigate = useNavigate();
  const { exercises, completeFoundationSession, updateUser } = useAppStore();
  const [currentStep, setCurrentStep] = useState<'intro' | 'exercises' | 'complete'>('intro');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [currentWeight, setCurrentWeight] = useState(135);
  const [currentReps, setCurrentReps] = useState(0);

  const foundationExercises = exercises.filter(ex => 
    ['squat', 'bench', 'deadlift', 'ohp'].includes(ex.id)
  );
  const foundationWorkout = generateFoundationWorkout(foundationExercises.map(ex => ex.id));
  const currentExercise = foundationExercises[currentExerciseIndex];
  const currentWorkoutData = foundationWorkout[currentExerciseIndex];

  const handleStartFoundation = () => {
    setCurrentStep('exercises');
    setCurrentWeight(currentWorkoutData?.suggestedWeight || 135);
  };

  const handleCompleteExercise = () => {
    if (currentReps === 0) return;

    const newResult: ExerciseResult = {
      exerciseId: currentExercise.id,
      weight: currentWeight,
      reps: currentReps
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    if (currentExerciseIndex < foundationExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      const nextWorkoutData = foundationWorkout[currentExerciseIndex + 1];
      setCurrentWeight(nextWorkoutData?.suggestedWeight || 135);
      setCurrentReps(0);
    } else {
      completeFoundationSession(updatedResults);
      setCurrentStep('complete');
    }
  };

  const handleFinishOnboarding = () => {
    navigate('/');
  };

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-evolve-dark flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-evolve-blue to-evolve-green rounded-2xl flex items-center justify-center mx-auto">
              <Zap size={32} className="text-evolve-dark" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Welcome to Evolve</h1>
            <p className="text-evolve-text-muted text-lg leading-relaxed">
              Let's establish your strength baseline with a quick Foundation session. 
              This will calibrate your starting weights for optimal progression.
            </p>
          </div>

          <div className="card text-left space-y-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-evolve-blue mt-0.5" />
              <div>
                <h3 className="font-semibold text-evolve-text mb-2">How it works:</h3>
                <ul className="space-y-2 text-evolve-text-muted text-sm">
                  <li>• Perform one AMRAP set for each core exercise</li>
                  <li>• Use a moderate weight (leave 1-2 reps in reserve)</li>
                  <li>• We'll calculate your estimated 1RM and create your program</li>
                  <li>• Takes about 20-30 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartFoundation}
            className="button-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            Start Foundation Session
            <ChevronRight size={20} />
          </button>

          <p className="text-evolve-text-muted text-sm">
            Already know your lifts? You can skip this and set them manually in Settings later.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'exercises') {
    return (
      <div className="min-h-screen bg-evolve-dark flex items-center justify-center px-6">
        <div className="max-w-lg w-full space-y-8 animate-fade-in">
          {/* Progress */}
          <div className="text-center space-y-2">
            <div className="text-evolve-text-muted text-sm">
              Exercise {currentExerciseIndex + 1} of {foundationExercises.length}
            </div>
            <div className="w-full bg-evolve-light-gray rounded-full h-2">
              <div 
                className="bg-evolve-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExerciseIndex + 1) / foundationExercises.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Exercise Info */}
          <div className="card text-center space-y-4">
            <h2 className="text-2xl font-bold text-evolve-text">
              {currentExercise.name}
            </h2>
            <p className="text-evolve-text-muted">
              {currentExercise.description}
            </p>
            
            <div className="bg-evolve-light-gray rounded-xl p-4 space-y-3">
              <div className="text-evolve-text font-semibold">Instructions:</div>
              <div className="text-evolve-text-muted text-sm">
                Warm up, then perform one set to near failure (leave 1-2 reps in reserve). 
                Focus on perfect form.
              </div>
            </div>
          </div>

          {/* Weight Input */}
          <div className="card space-y-4">
            <div className="text-center">
              <label className="block text-evolve-text font-semibold mb-2">
                Weight Used (lbs)
              </label>
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="input-field text-center text-2xl font-bold w-32 mx-auto"
                step="5"
              />
            </div>

            <div className="text-center">
              <label className="block text-evolve-text font-semibold mb-2">
                Reps Completed
              </label>
              <input
                type="number"
                value={currentReps || ''}
                onChange={(e) => setCurrentReps(Number(e.target.value))}
                className="input-field text-center text-2xl font-bold w-32 mx-auto"
                placeholder="0"
                min="1"
                max="20"
              />
            </div>
          </div>

          <button
            onClick={handleCompleteExercise}
            disabled={currentReps === 0}
            className={`w-full flex items-center justify-center gap-2 text-lg ${
              currentReps === 0 
                ? 'bg-evolve-light-gray text-evolve-text-muted cursor-not-allowed' 
                : 'button-primary'
            } px-6 py-3 rounded-xl transition-all duration-200`}
          >
            {currentExerciseIndex === foundationExercises.length - 1 ? 'Complete Session' : 'Next Exercise'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-evolve-dark flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-evolve-green rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-evolve-text">Foundation Complete!</h1>
            <p className="text-evolve-text-muted text-lg">
              Your strength baseline has been established. Evolve will now generate 
              your personalized training program with intelligent progression.
            </p>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-evolve-text">Your Results:</h3>
            <div className="space-y-2">
              {results.map((result, index) => {
                const exercise = foundationExercises.find(ex => ex.id === result.exerciseId);
                const estimatedMax = Math.round(result.weight * (1 + result.reps / 30));
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-evolve-light-gray last:border-b-0">
                    <span className="text-evolve-text">{exercise?.name}</span>
                    <div className="text-right">
                      <div className="text-evolve-text font-semibold">
                        {result.weight} lbs × {result.reps}
                      </div>
                      <div className="text-evolve-text-muted text-sm">
                        Est. 1RM: {estimatedMax} lbs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleFinishOnboarding}
            className="button-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            Start Training
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Foundation;