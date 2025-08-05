import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, X, Play, Target, Clock, Dumbbell } from 'lucide-react';
import { useAppStore } from '../store';
import { Workout, WorkoutExercise, Set } from '../types';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  frequency: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    weight: number;
    restTime: number;
  }[];
}

const WorkoutPlans = () => {
  const navigate = useNavigate();
  const { exercises, startWorkout } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Predefined workout plans
  const workoutPlans: WorkoutPlan[] = [
    {
      id: 'beginner-strength',
      name: 'Beginner Strength',
      description: 'Perfect for those new to strength training. Focuses on learning proper form and building a foundation.',
      difficulty: 'Beginner',
      duration: '45-60 min',
      frequency: '3x per week',
      exercises: [
        { exerciseId: 'squat', sets: 3, reps: 8, weight: 65, restTime: 180 },
        { exerciseId: 'bench', sets: 3, reps: 8, weight: 95, restTime: 180 },
        { exerciseId: 'row', sets: 3, reps: 10, weight: 75, restTime: 120 },
      ]
    },
    {
      id: 'intermediate-powerlifting',
      name: 'Intermediate Powerlifting',
      description: 'Focused on the big three lifts with progressive overload. Build serious strength.',
      difficulty: 'Intermediate',
      duration: '60-75 min',
      frequency: '4x per week',
      exercises: [
        { exerciseId: 'squat', sets: 4, reps: 5, weight: 185, restTime: 300 },
        { exerciseId: 'bench', sets: 4, reps: 5, weight: 155, restTime: 300 },
        { exerciseId: 'deadlift', sets: 3, reps: 5, weight: 225, restTime: 300 },
        { exerciseId: 'ohp', sets: 3, reps: 8, weight: 95, restTime: 180 },
      ]
    },
    {
      id: 'advanced-volume',
      name: 'Advanced Volume',
      description: 'High volume training for experienced lifters. Push your limits with increased training load.',
      difficulty: 'Advanced',
      duration: '75-90 min',
      frequency: '5x per week',
      exercises: [
        { exerciseId: 'squat', sets: 5, reps: 5, weight: 245, restTime: 300 },
        { exerciseId: 'bench', sets: 4, reps: 6, weight: 185, restTime: 240 },
        { exerciseId: 'deadlift', sets: 4, reps: 3, weight: 285, restTime: 300 },
        { exerciseId: 'ohp', sets: 4, reps: 8, weight: 115, restTime: 180 },
        { exerciseId: 'row', sets: 4, reps: 8, weight: 155, restTime: 180 },
      ]
    },
    {
      id: 'hypertrophy-focused',
      name: 'Hypertrophy Focus',
      description: 'Designed for muscle growth with moderate weights and higher rep ranges.',
      difficulty: 'Intermediate',
      duration: '60-75 min',
      frequency: '4x per week',
      exercises: [
        { exerciseId: 'squat', sets: 4, reps: 10, weight: 155, restTime: 120 },
        { exerciseId: 'bench', sets: 4, reps: 10, weight: 135, restTime: 120 },
        { exerciseId: 'row', sets: 4, reps: 12, weight: 115, restTime: 90 },
        { exerciseId: 'ohp', sets: 3, reps: 12, weight: 75, restTime: 90 },
      ]
    }
  ];

  const handleViewDetails = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const handleStartPlan = (plan: WorkoutPlan) => {
    // Convert plan to workout format
    const workoutExercises: WorkoutExercise[] = plan.exercises.map((planExercise) => {
      const exercise = exercises.find(ex => ex.id === planExercise.exerciseId)!;
      
      const sets: Set[] = Array.from({ length: planExercise.sets }, (_, setIndex) => ({
        id: `set-${planExercise.exerciseId}-${setIndex}`,
        weight: planExercise.weight,
        reps: 0,
        targetReps: planExercise.reps,
        targetWeight: planExercise.weight,
        completed: false,
        timestamp: new Date()
      }));

      return {
        id: `exercise-${planExercise.exerciseId}`,
        exerciseId: planExercise.exerciseId,
        exercise,
        sets,
        targetSets: planExercise.sets,
        targetWeight: planExercise.weight,
        targetReps: planExercise.reps,
        restTime: planExercise.restTime
      };
    });

    const workout: Workout = {
      id: `workout-${Date.now()}`,
      name: plan.name,
      date: new Date(),
      exercises: workoutExercises,
      completed: false
    };

    startWorkout(workout);
    navigate('/workout');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-evolve-green bg-evolve-green/20';
      case 'Intermediate': return 'text-evolve-blue bg-evolve-blue/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-evolve-text-muted bg-evolve-light-gray';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-evolve-text">
          Workout <span className="text-gradient">Plans</span>
        </h1>
        <p className="text-evolve-text-muted">
          Choose from our curated workout plans designed for every fitness level
        </p>
      </div>

      {/* Workout Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {workoutPlans.map((plan) => (
          <div key={plan.id} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-evolve-text">{plan.name}</h3>
                <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                  {plan.difficulty}
                </div>
              </div>
              <div className="w-12 h-12 bg-evolve-blue/20 rounded-xl flex items-center justify-center">
                <Dumbbell size={20} className="text-evolve-blue" />
              </div>
            </div>

            <p className="text-evolve-text-muted text-sm">{plan.description}</p>

            <div className="flex items-center gap-4 text-sm text-evolve-text-muted">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {plan.duration}
              </div>
              <div className="flex items-center gap-1">
                <Target size={14} />
                {plan.frequency}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-evolve-text">Exercises ({plan.exercises.length})</div>
              <div className="flex flex-wrap gap-2">
                {plan.exercises.slice(0, 3).map((planExercise) => {
                  const exercise = exercises.find(ex => ex.id === planExercise.exerciseId);
                  return (
                    <div key={planExercise.exerciseId} className="bg-evolve-light-gray px-2 py-1 rounded-lg text-xs text-evolve-text">
                      {exercise?.name}
                    </div>
                  );
                })}
                {plan.exercises.length > 3 && (
                  <div className="bg-evolve-light-gray px-2 py-1 rounded-lg text-xs text-evolve-text-muted">
                    +{plan.exercises.length - 3} more
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleViewDetails(plan)}
                className="flex-1 button-secondary flex items-center justify-center gap-2"
              >
                <Info size={16} />
                View Details
              </button>
              <button
                onClick={() => handleStartPlan(plan)}
                className="flex-1 button-primary flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Start Plan
              </button>
            </div>
          </div>
        ))}
      </div>

            {/* Workout Plan Details Modal */}
      {showDetails && selectedPlan && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '10px',
              padding: '30px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{selectedPlan.name}</h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>{selectedPlan.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedPlan.duration}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>Duration</div>
              </div>
              <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedPlan.frequency}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>Frequency</div>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Exercises</h3>
            <div style={{ marginBottom: '20px' }}>
              {selectedPlan.exercises.map((planExercise, index) => {
                const exercise = exercises.find(ex => ex.id === planExercise.exerciseId);
                if (!exercise) return null;
                return (
                  <div key={planExercise.exerciseId} style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '10px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{exercise.name}</h4>
                        <div style={{ fontSize: '14px' }}>
                          <strong>{planExercise.sets} sets</strong> × <strong>{planExercise.reps} reps</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                          {planExercise.weight} lbs
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Rest: {Math.floor(planExercise.restTime / 60)}:{(planExercise.restTime % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f0f0f0',
                  color: 'black',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetails(false);
                  handleStartPlan(selectedPlan);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Start This Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans;