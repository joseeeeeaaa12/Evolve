import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Calendar, Target, Award, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { Workout, WorkoutExercise, Set } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, exercises, startWorkout, calculateNextWorkout } = useAppStore();
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);

  if (!user) return null;

  const generateTodaysWorkout = (): Workout => {
    // Simple 3-day rotation: A (Squat focus), B (Bench focus), C (Deadlift focus)
    const workoutCount = user.stats.totalWorkouts;
    const workoutType = workoutCount % 3;
    
    let workoutName = '';
    let exerciseIds: string[] = [];
    
    switch (workoutType) {
      case 0: // Squat Day
        workoutName = 'Squat Focus';
        exerciseIds = ['squat', 'bench', 'row'];
        break;
      case 1: // Bench Day
        workoutName = 'Bench Focus';
        exerciseIds = ['bench', 'squat', 'ohp'];
        break;
      case 2: // Deadlift Day
        workoutName = 'Deadlift Focus';
        exerciseIds = ['deadlift', 'ohp', 'row'];
        break;
    }

    const workoutExercises: WorkoutExercise[] = exerciseIds.map((exerciseId, index) => {
      const exercise = exercises.find(ex => ex.id === exerciseId)!;
      const progression = calculateNextWorkout(exerciseId);
      
      const sets: Set[] = Array.from({ length: progression.sets }, (_, setIndex) => ({
        id: `set-${exerciseId}-${setIndex}`,
        weight: progression.weight,
        reps: 0,
        targetReps: progression.reps,
        targetWeight: progression.weight,
        completed: false,
        timestamp: new Date()
      }));

      return {
        id: `exercise-${exerciseId}`,
        exerciseId,
        exercise,
        sets,
        targetSets: progression.sets,
        targetWeight: progression.weight,
        targetReps: progression.reps,
        restTime: index === 0 ? 300 : 180 // 5 min for main lift, 3 min for accessories
      };
    });

    return {
      id: `workout-${Date.now()}`,
      name: workoutName,
      date: new Date(),
      exercises: workoutExercises,
      completed: false
    };
  };

  const handleStartWorkout = () => {
    setIsGeneratingWorkout(true);
    setTimeout(() => {
      const workout = generateTodaysWorkout();
      startWorkout(workout);
      navigate('/workout');
      setIsGeneratingWorkout(false);
    }, 1000);
  };

  const nextWorkout = generateTodaysWorkout();
  const recentPRs = user.stats.personalRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-evolve-text">
          Ready to <span className="text-gradient">Evolve</span>?
        </h1>
        <p className="text-evolve-text-muted">
          {format(new Date(), 'EEEE, MMMM do')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center space-y-2">
          <div className="text-2xl font-bold text-evolve-blue">
            {user.stats.totalWorkouts}
          </div>
          <div className="text-evolve-text-muted text-sm">Workouts</div>
        </div>
        <div className="card text-center space-y-2">
          <div className="text-2xl font-bold text-evolve-green">
            {Math.round(user.stats.totalVolume).toLocaleString()}
          </div>
          <div className="text-evolve-text-muted text-sm">Total lbs</div>
        </div>
        <div className="card text-center space-y-2">
          <div className="text-2xl font-bold text-evolve-blue">
            {user.stats.personalRecords.length}
          </div>
          <div className="text-evolve-text-muted text-sm">PRs</div>
        </div>
      </div>

      {/* Next Workout Card */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-evolve-blue/20 rounded-xl flex items-center justify-center">
              <Target size={20} className="text-evolve-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-evolve-text">Next Workout</h2>
              <p className="text-evolve-text-muted text-sm">{nextWorkout.name}</p>
            </div>
          </div>
          <Calendar size={20} className="text-evolve-text-muted" />
        </div>

        <div className="space-y-4">
          {nextWorkout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between p-4 bg-evolve-light-gray rounded-xl">
              <div>
                <div className="font-semibold text-evolve-text">{exercise.exercise.name}</div>
                <div className="text-evolve-text-muted text-sm">
                  {exercise.targetSets} × {exercise.targetReps} reps
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-evolve-blue">
                  {exercise.targetWeight} lbs
                </div>
                {index === 0 && (
                  <div className="text-evolve-green text-xs font-medium">Main Lift</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartWorkout}
          disabled={isGeneratingWorkout}
          className={`w-full flex items-center justify-center gap-3 text-lg ${
            isGeneratingWorkout 
              ? 'bg-evolve-light-gray text-evolve-text-muted cursor-not-allowed' 
              : 'button-primary'
          } px-6 py-4 rounded-xl transition-all duration-200`}
        >
          {isGeneratingWorkout ? (
            <>
              <div className="w-5 h-5 border-2 border-evolve-text-muted border-t-transparent rounded-full animate-spin"></div>
              Generating Workout...
            </>
          ) : (
            <>
              <Play size={20} />
              Start Workout
            </>
          )}
        </button>
      </div>

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-evolve-green/20 rounded-xl flex items-center justify-center">
              <Award size={16} className="text-evolve-green" />
            </div>
            <h3 className="text-lg font-semibold text-evolve-text">Recent PRs</h3>
          </div>
          
          <div className="space-y-3">
            {recentPRs.map((pr, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-evolve-light-gray rounded-xl">
                <div>
                  <div className="font-medium text-evolve-text">{pr.exercise.name}</div>
                  <div className="text-evolve-text-muted text-sm">
                    {format(new Date(pr.date), 'MMM d')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-evolve-green">
                    {pr.weight} lbs × {pr.reps}
                  </div>
                  <div className="text-evolve-text-muted text-sm">
                    Est. 1RM: {pr.estimatedOneRM} lbs
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => navigate('/progress')}
            className="w-full button-secondary flex items-center justify-center gap-2"
          >
            View All Progress
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="card text-center space-y-4 bg-gradient-to-r from-evolve-blue/10 to-evolve-green/10 border-evolve-blue/20">
        <div className="text-lg font-medium text-evolve-text">
          "The groundwork for all happiness is good health."
        </div>
        <div className="text-evolve-text-muted text-sm">— Leigh Hunt</div>
      </div>
    </div>
  );
};

export default Dashboard;