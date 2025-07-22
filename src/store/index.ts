import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Workout, Exercise, WorkoutSet, TimerState, PersonalRecord, ProgressionRule } from '../types';
import { calculateOneRM, generateProgression } from '../utils/progression';

interface AppState {
  user: User | null;
  currentWorkout: Workout | null;
  workoutHistory: Workout[];
  exercises: Exercise[];
  timer: TimerState;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Workout actions
  startWorkout: (workout: Workout) => void;
  completeWorkout: () => void;
  updateCurrentWorkout: (workout: Workout) => void;
  
  // Exercise actions
  completeSet: (exerciseId: string, setId: string, weight: number, reps: number, rpe?: number) => void;
  addSet: (exerciseId: string) => void;
  updateExerciseWeight: (exerciseId: string, weight: number) => void;
  
  // Timer actions
  startTimer: (duration: number, exerciseId?: string) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  
  // Progression actions
  calculateNextWorkout: (exerciseId: string) => { weight: number; reps: number; sets: number };
  updatePersonalRecord: (exerciseId: string, weight: number, reps: number) => void;
  
  // Foundation session
  completeFoundationSession: (results: { exerciseId: string; weight: number; reps: number }[]) => void;
}

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Barbell Back Squat',
    category: 'compound',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    description: 'The king of all exercises. Stand with feet shoulder-width apart, descend until thighs are parallel to the floor.'
  },
  {
    id: 'bench',
    name: 'Barbell Bench Press',
    category: 'compound',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    description: 'Lie on bench, lower bar to chest, press up explosively.'
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    category: 'compound',
    muscleGroups: ['hamstrings', 'glutes', 'back', 'traps', 'core'],
    description: 'Hip hinge movement, lift the bar from the floor to standing position.'
  },
  {
    id: 'ohp',
    name: 'Overhead Press',
    category: 'compound',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    description: 'Standing press, bar from shoulders to overhead, keep core tight.'
  },
  {
    id: 'row',
    name: 'Barbell Row',
    category: 'compound',
    muscleGroups: ['lats', 'rhomboids', 'rear delts', 'biceps'],
    description: 'Bent over row, pull bar to lower chest, squeeze shoulder blades.'
  }
];

const createDefaultUser = (): User => ({
  id: 'user-1',
  name: '',
  isOnboarded: false,
  estimatedOneRMs: {},
  progressionRules: {},
  stats: {
    totalWorkouts: 0,
    totalSets: 0,
    totalVolume: 0,
    currentStreak: 0,
    longestStreak: 0,
    personalRecords: []
  },
  preferences: {
    units: 'lbs',
    defaultRestTime: 180, // 3 minutes
    soundEnabled: true,
    hapticEnabled: true
  }
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: createDefaultUser(),
      currentWorkout: null,
      workoutHistory: [],
      exercises: DEFAULT_EXERCISES,
      timer: {
        isActive: false,
        timeRemaining: 0,
        totalTime: 0
      },

      setUser: (user) => set({ user }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      startWorkout: (workout) => set({ currentWorkout: workout }),
      
      completeWorkout: () => set((state) => {
        if (!state.currentWorkout || !state.user) return state;
        
        const completedWorkout = { ...state.currentWorkout, completed: true };
        const updatedHistory = [completedWorkout, ...state.workoutHistory];
        
        // Update user stats
        const totalSets = completedWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        const totalVolume = completedWorkout.exercises.reduce((acc, ex) => 
          acc + ex.sets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0
        );
        
        const updatedUser: User = {
          ...state.user,
          stats: {
            ...state.user.stats,
            totalWorkouts: state.user.stats.totalWorkouts + 1,
            totalSets: state.user.stats.totalSets + totalSets,
            totalVolume: state.user.stats.totalVolume + totalVolume
          }
        };

        return {
          currentWorkout: null,
          workoutHistory: updatedHistory,
          user: updatedUser
        };
      }),
      
      updateCurrentWorkout: (workout) => set({ currentWorkout: workout }),
      
      completeSet: (exerciseId, setId, weight, reps, rpe) => set((state) => {
        if (!state.currentWorkout) return state;
        
        const updatedExercises = state.currentWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            const updatedSets = ex.sets.map(set => {
              if (set.id === setId) {
                return {
                  ...set,
                  weight,
                  reps,
                  rpe,
                  completed: true,
                  timestamp: new Date()
                };
              }
              return set;
            });
            return { ...ex, sets: updatedSets };
          }
          return ex;
        });
        
        return {
          currentWorkout: {
            ...state.currentWorkout,
            exercises: updatedExercises
          }
        };
      }),
      
      addSet: (exerciseId) => set((state) => {
        if (!state.currentWorkout) return state;
        
        const updatedExercises = state.currentWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            const newSet: WorkoutSet = {
              id: `set-${Date.now()}`,
              weight: ex.targetWeight,
              reps: 0,
              targetReps: ex.targetReps,
              targetWeight: ex.targetWeight,
              completed: false,
              timestamp: new Date()
            };
            return { ...ex, sets: [...ex.sets, newSet] };
          }
          return ex;
        });
        
        return {
          currentWorkout: {
            ...state.currentWorkout,
            exercises: updatedExercises
          }
        };
      }),
      
      updateExerciseWeight: (exerciseId, weight) => set((state) => {
        if (!state.currentWorkout) return state;
        
        const updatedExercises = state.currentWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, targetWeight: weight };
          }
          return ex;
        });
        
        return {
          currentWorkout: {
            ...state.currentWorkout,
            exercises: updatedExercises
          }
        };
      }),
      
      startTimer: (duration, exerciseId) => set({
        timer: {
          isActive: true,
          timeRemaining: duration,
          totalTime: duration,
          exerciseId
        }
      }),
      
      pauseTimer: () => set((state) => ({
        timer: { ...state.timer, isActive: false }
      })),
      
      stopTimer: () => set({
        timer: {
          isActive: false,
          timeRemaining: 0,
          totalTime: 0
        }
      }),
      
      tickTimer: () => set((state) => {
        if (!state.timer.isActive || state.timer.timeRemaining <= 0) {
          return {
            timer: { ...state.timer, isActive: false, timeRemaining: 0 }
          };
        }
        return {
          timer: { ...state.timer, timeRemaining: state.timer.timeRemaining - 1 }
        };
      }),
      
      calculateNextWorkout: (exerciseId) => {
        const state = get();
        if (!state.user) return { weight: 0, reps: 5, sets: 3 };
        
        const rule = state.user.progressionRules[exerciseId];
        const oneRM = state.user.estimatedOneRMs[exerciseId];
        
        return generateProgression(rule, oneRM, state.user.preferences.units);
      },
      
      updatePersonalRecord: (exerciseId, weight, reps) => set((state) => {
        if (!state.user) return state;
        
        const exercise = state.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return state;
        
        const estimatedOneRM = calculateOneRM(weight, reps);
        const currentPR = state.user.stats.personalRecords.find(pr => pr.exerciseId === exerciseId);
        
        if (!currentPR || estimatedOneRM > currentPR.estimatedOneRM) {
          const newPR: PersonalRecord = {
            exerciseId,
            exercise,
            weight,
            reps,
            date: new Date(),
            estimatedOneRM
          };
          
          const updatedPRs = state.user.stats.personalRecords.filter(pr => pr.exerciseId !== exerciseId);
          updatedPRs.push(newPR);
          
          return {
            user: {
              ...state.user,
              stats: {
                ...state.user.stats,
                personalRecords: updatedPRs
              },
              estimatedOneRMs: {
                ...state.user.estimatedOneRMs,
                [exerciseId]: estimatedOneRM
              }
            }
          };
        }
        
        return state;
      }),
      
      completeFoundationSession: (results) => set((state) => {
        if (!state.user) return state;
        
        const estimatedOneRMs: Record<string, number> = {};
        const progressionRules: Record<string, ProgressionRule> = {};
        const personalRecords: PersonalRecord[] = [];
        
        results.forEach(result => {
          const oneRM = calculateOneRM(result.weight, result.reps);
          const exercise = state.exercises.find(ex => ex.id === result.exerciseId);
          
          if (exercise) {
            estimatedOneRMs[result.exerciseId] = oneRM;
            progressionRules[result.exerciseId] = {
              exerciseId: result.exerciseId,
              successfulSessions: 0,
              failedSessions: 0,
              lastWeightIncrease: null,
              currentWeight: Math.round(oneRM * 0.75), // Start at 75% of 1RM
              plateauCount: 0
            };
            
            personalRecords.push({
              exerciseId: result.exerciseId,
              exercise,
              weight: result.weight,
              reps: result.reps,
              date: new Date(),
              estimatedOneRM: oneRM
            });
          }
        });
        
        return {
          user: {
            ...state.user,
            isOnboarded: true,
            estimatedOneRMs,
            progressionRules,
            stats: {
              ...state.user.stats,
              personalRecords
            }
          }
        };
      })
    }),
    {
      name: 'evolve-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
);