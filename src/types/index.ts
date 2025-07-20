export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'accessory';
  muscleGroups: string[];
  description?: string;
  videoUrl?: string;
}

export interface Set {
  id: string;
  weight: number;
  reps: number;
  targetReps: number;
  targetWeight: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  rir?: number; // Reps in Reserve
  completed: boolean;
  timestamp: Date;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: Set[];
  targetSets: number;
  targetWeight: number;
  targetReps: number;
  notes?: string;
  restTime: number; // in seconds
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  completed: boolean;
  duration?: number; // in minutes
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exercise: Exercise;
  weight: number;
  reps: number;
  date: Date;
  estimatedOneRM: number;
}

export interface UserStats {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number; // total weight lifted
  currentStreak: number;
  longestStreak: number;
  personalRecords: PersonalRecord[];
}

export interface ProgressionRule {
  exerciseId: string;
  successfulSessions: number;
  failedSessions: number;
  lastWeightIncrease: Date | null;
  currentWeight: number;
  plateauCount: number;
}

export interface User {
  id: string;
  name: string;
  isOnboarded: boolean;
  estimatedOneRMs: Record<string, number>; // exerciseId -> 1RM
  progressionRules: Record<string, ProgressionRule>; // exerciseId -> rule
  stats: UserStats;
  preferences: {
    units: 'kg' | 'lbs';
    defaultRestTime: number;
    soundEnabled: boolean;
    hapticEnabled: boolean;
  };
}

export interface TimerState {
  isActive: boolean;
  timeRemaining: number;
  totalTime: number;
  exerciseId?: string;
}