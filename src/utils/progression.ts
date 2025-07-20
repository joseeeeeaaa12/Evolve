import { ProgressionRule } from '../types';

// Epley formula for calculating estimated 1RM
export const calculateOneRM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

// Brzycki formula (alternative)
export const calculateOneRMBrzycki = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (36 / (37 - reps)));
};

// Calculate percentage of 1RM
export const calculatePercentage = (oneRM: number, percentage: number): number => {
  return Math.round(oneRM * (percentage / 100));
};

// Round weight to nearest increment based on units
export const roundWeight = (weight: number, units: 'kg' | 'lbs'): number => {
  const increment = units === 'kg' ? 1.25 : 2.5; // 1.25kg or 2.5lbs increments
  return Math.round(weight / increment) * increment;
};

// Generate next workout progression based on performance
export const generateProgression = (
  rule: ProgressionRule | undefined,
  oneRM: number,
  units: 'kg' | 'lbs'
): { weight: number; reps: number; sets: number } => {
  if (!rule || !oneRM) {
    return { weight: 0, reps: 5, sets: 3 };
  }

  const baseWeight = rule.currentWeight;
  const increment = units === 'kg' ? 1.25 : 2.5;
  
  // Default progression scheme (3x5)
  let targetWeight = baseWeight;
  let targetReps = 5;
  let targetSets = 3;

  // Success: completed all reps for all sets
  if (rule.successfulSessions >= 1 && rule.failedSessions === 0) {
    targetWeight = roundWeight(baseWeight + increment, units);
  }
  
  // Plateau: failed multiple sessions, suggest deload
  if (rule.plateauCount >= 2) {
    targetWeight = roundWeight(baseWeight * 0.85, units); // 15% deload
    targetReps = 5;
    targetSets = 3;
  }
  
  // Advanced progression: if close to 1RM, reduce reps and increase weight
  const percentageOf1RM = (targetWeight / oneRM) * 100;
  
  if (percentageOf1RM > 90) {
    targetReps = 3;
    targetSets = 3;
  } else if (percentageOf1RM > 85) {
    targetReps = 4;
    targetSets = 3;
  }

  return {
    weight: Math.max(targetWeight, increment), // Never go below minimum increment
    reps: targetReps,
    sets: targetSets
  };
};

// Update progression rule based on workout performance
export const updateProgressionRule = (
  rule: ProgressionRule,
  completed: boolean,
  targetWeight: number
): ProgressionRule => {
  const updatedRule = { ...rule };

  if (completed) {
    updatedRule.successfulSessions += 1;
    updatedRule.failedSessions = 0; // Reset failed sessions on success
    updatedRule.plateauCount = 0; // Reset plateau count on success
    
    if (targetWeight > rule.currentWeight) {
      updatedRule.lastWeightIncrease = new Date();
      updatedRule.currentWeight = targetWeight;
    }
  } else {
    updatedRule.failedSessions += 1;
    updatedRule.successfulSessions = 0; // Reset successful sessions on failure
    
    if (updatedRule.failedSessions >= 2) {
      updatedRule.plateauCount += 1;
    }
  }

  return updatedRule;
};

// Generate a foundation workout for strength testing
export const generateFoundationWorkout = (exercises: string[]) => {
  const foundationWeights: Record<string, number> = {
    'squat': 135,
    'bench': 95,
    'deadlift': 135,
    'ohp': 65,
    'row': 95
  };

  return exercises.map(exerciseId => ({
    exerciseId,
    suggestedWeight: foundationWeights[exerciseId] || 95,
    targetReps: 'AMRAP', // As Many Reps As Possible
    instructions: 'Perform one set with moderate weight until failure (leave 1-2 reps in reserve)'
  }));
};

// Format time for display (MM:SS)
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Calculate workout volume
export const calculateVolume = (weight: number, reps: number, sets: number): number => {
  return weight * reps * sets;
};

// Determine if a set was successful based on target
export const isSetSuccessful = (actualReps: number, targetReps: number): boolean => {
  return actualReps >= targetReps;
};

// Calculate total workout success rate
export const calculateWorkoutSuccess = (
  completedSets: number,
  totalSets: number,
  completedReps: number,
  totalTargetReps: number
): number => {
  const setSuccess = (completedSets / totalSets) * 100;
  const repSuccess = (completedReps / totalTargetReps) * 100;
  return Math.round((setSuccess + repSuccess) / 2);
};