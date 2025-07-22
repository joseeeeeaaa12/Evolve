import { useState } from 'react';
import { TrendingUp, Award, Target, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Progress = () => {
  const { user, workoutHistory } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  if (!user) return null;

  // Generate progress data for charts
  const generateProgressData = () => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate.toDateString() === date.toDateString();
      });

      const totalVolume = dayWorkouts.reduce((acc, workout) => 
        acc + workout.exercises.reduce((exerciseAcc, exercise) => 
          exerciseAcc + exercise.sets.reduce((setAcc, set) => 
            setAcc + (set.weight * set.reps), 0
          ), 0
        ), 0
      );

      data.push({
        date: format(date, selectedPeriod === 'week' ? 'EEE' : selectedPeriod === 'month' ? 'MMM d' : 'MMM yyyy'),
        volume: totalVolume,
        workouts: dayWorkouts.length
      });
    }
    
    return data;
  };

  // Generate strength progression data for main lifts
  const generateStrengthData = () => {
    const mainLifts = ['squat', 'bench', 'deadlift', 'ohp'];
    const strengthData: any = {};

    mainLifts.forEach(exerciseId => {
      const exerciseHistory = workoutHistory
        .flatMap(workout => workout.exercises.filter(ex => ex.exerciseId === exerciseId))
        .sort((a, b) => new Date(a.sets[0]?.timestamp || 0).getTime() - new Date(b.sets[0]?.timestamp || 0).getTime());

      strengthData[exerciseId] = exerciseHistory.map((exercise, index) => {
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
        return {
          session: index + 1,
          weight: maxWeight,
          date: format(new Date(exercise.sets[0]?.timestamp || new Date()), 'MMM d')
        };
      });
    });

    return strengthData;
  };

  const progressData = generateProgressData();
  const strengthData = generateStrengthData();
  const totalWorkouts = user.stats.totalWorkouts;
  const totalVolume = Math.round(user.stats.totalVolume);
  const averageVolume = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0;

  // Recent achievements
  const recentPRs = user.stats.personalRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-evolve-text">Your Progress</h1>
        <p className="text-evolve-text-muted">Track your strength evolution</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center">
        <div className="bg-evolve-gray rounded-xl p-1 flex gap-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                selectedPeriod === period
                  ? 'bg-evolve-blue text-evolve-dark'
                  : 'text-evolve-text-muted hover:text-evolve-text'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center space-y-2">
          <div className="w-10 h-10 bg-evolve-blue/20 rounded-xl flex items-center justify-center mx-auto">
            <BarChart3 size={16} className="text-evolve-blue" />
          </div>
          <div className="text-2xl font-bold text-evolve-text">{totalWorkouts}</div>
          <div className="text-evolve-text-muted text-sm">Total Workouts</div>
        </div>

        <div className="card text-center space-y-2">
          <div className="w-10 h-10 bg-evolve-green/20 rounded-xl flex items-center justify-center mx-auto">
            <TrendingUp size={16} className="text-evolve-green" />
          </div>
          <div className="text-2xl font-bold text-evolve-text">{totalVolume.toLocaleString()}</div>
          <div className="text-evolve-text-muted text-sm">Total Volume (lbs)</div>
        </div>

        <div className="card text-center space-y-2">
          <div className="w-10 h-10 bg-evolve-blue/20 rounded-xl flex items-center justify-center mx-auto">
            <Target size={16} className="text-evolve-blue" />
          </div>
          <div className="text-2xl font-bold text-evolve-text">{averageVolume.toLocaleString()}</div>
          <div className="text-evolve-text-muted text-sm">Avg Volume</div>
        </div>

        <div className="card text-center space-y-2">
          <div className="w-10 h-10 bg-evolve-green/20 rounded-xl flex items-center justify-center mx-auto">
            <Award size={16} className="text-evolve-green" />
          </div>
          <div className="text-2xl font-bold text-evolve-text">{recentPRs.length}</div>
          <div className="text-evolve-text-muted text-sm">Personal Records</div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="card space-y-4">
        <h3 className="text-xl font-bold text-evolve-text">Training Volume</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" />
              <XAxis 
                dataKey="date" 
                stroke="#a0a0a0"
                fontSize={12}
              />
              <YAxis 
                stroke="#a0a0a0"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a1a1b',
                  border: '1px solid #2a2a2b',
                  borderRadius: '12px',
                  color: '#ffffff'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} lbs`, 'Volume']}
              />
              <Bar 
                dataKey="volume" 
                fill="#00d4ff"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strength Progression Charts */}
      {Object.keys(strengthData).map(exerciseId => {
        const exercise = user.stats.personalRecords.find(pr => pr.exerciseId === exerciseId)?.exercise;
        const data = strengthData[exerciseId];
        
        if (!exercise || !data.length) return null;

        return (
          <div key={exerciseId} className="card space-y-4">
            <h3 className="text-xl font-bold text-evolve-text">{exercise.name} Progression</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#a0a0a0"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#a0a0a0"
                    fontSize={12}
                    tickFormatter={(value) => `${value} lbs`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1a1a1b',
                      border: '1px solid #2a2a2b',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                    formatter={(value: number) => [`${value} lbs`, 'Max Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#00ff88"
                    strokeWidth={3}
                    dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#00ff88', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      {/* Personal Records */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-evolve-green/20 rounded-xl flex items-center justify-center">
            <Award size={16} className="text-evolve-green" />
          </div>
          <h3 className="text-xl font-bold text-evolve-text">Personal Records</h3>
        </div>

        {recentPRs.length === 0 ? (
          <div className="text-center py-8 text-evolve-text-muted">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>Complete your Foundation session to start tracking PRs!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPRs.map((pr, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-evolve-light-gray rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-evolve-green text-evolve-dark' : 'bg-evolve-gray text-evolve-text'
                  }`}>
                    {index === 0 ? '🏆' : index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-evolve-text">{pr.exercise.name}</div>
                    <div className="text-evolve-text-muted text-sm">
                      {format(new Date(pr.date), 'MMM d, yyyy')}
                    </div>
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
        )}
      </div>

      {/* Motivational Section */}
      <div className="card text-center space-y-4 bg-gradient-to-r from-evolve-blue/10 to-evolve-green/10 border-evolve-blue/20">
        <div className="text-4xl">📈</div>
        <div className="text-lg font-semibold text-evolve-text">
          {totalWorkouts === 0 
            ? "Your journey starts now!" 
            : totalWorkouts < 10 
            ? "Building momentum!" 
            : totalWorkouts < 50 
            ? "Consistency is key!" 
            : "You're crushing it!"}
        </div>
        <div className="text-evolve-text-muted">
          {totalWorkouts === 0 
            ? "Complete your first workout to see your progress here." 
            : "Every rep counts towards your evolution."}
        </div>
      </div>
    </div>
  );
};

export default Progress;