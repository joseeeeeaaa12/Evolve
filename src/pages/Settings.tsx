import { useState } from 'react';
import { Save, User, Volume2, VolumeX, Smartphone, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser, setUser } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    name: user?.name || '',
    units: user?.preferences.units || 'lbs',
    defaultRestTime: user?.preferences.defaultRestTime || 180,
    soundEnabled: user?.preferences.soundEnabled ?? true,
    hapticEnabled: user?.preferences.hapticEnabled ?? true,
  });

  if (!user) return null;

  const handleSave = () => {
    updateUser({
      name: tempSettings.name,
      preferences: {
        ...user.preferences,
        units: tempSettings.units as 'kg' | 'lbs',
        defaultRestTime: tempSettings.defaultRestTime,
        soundEnabled: tempSettings.soundEnabled,
        hapticEnabled: tempSettings.hapticEnabled,
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings({
      name: user.name,
      units: user.preferences.units,
      defaultRestTime: user.preferences.defaultRestTime,
      soundEnabled: user.preferences.soundEnabled,
      hapticEnabled: user.preferences.hapticEnabled,
    });
    setIsEditing(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      const resetUser = {
        ...user,
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
        }
      };
      setUser(resetUser);
      navigate('/foundation');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-evolve-text">Settings</h1>
        <p className="text-evolve-text-muted">Customize your Evolve experience</p>
      </div>

      {/* Profile Section */}
      <div className="card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-evolve-blue/20 rounded-xl flex items-center justify-center">
            <User size={20} className="text-evolve-blue" />
          </div>
          <h2 className="text-xl font-bold text-evolve-text">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-evolve-text font-medium mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempSettings.name}
                onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
                className="input-field w-full"
                placeholder="Enter your name"
              />
            ) : (
              <div className="text-evolve-text-muted">
                {user.name || 'Not set'}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-evolve-light-gray">
            <div className="text-evolve-text-muted text-sm">
              Member since Foundation session
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="button-secondary"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-evolve-light-gray text-evolve-text rounded-lg hover:bg-evolve-light-gray/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="button-primary flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="card space-y-6">
        <h2 className="text-xl font-bold text-evolve-text">Preferences</h2>

        <div className="space-y-6">
          {/* Units */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-evolve-text font-medium">Units</div>
              <div className="text-evolve-text-muted text-sm">Weight measurement system</div>
            </div>
            <div className="bg-evolve-gray rounded-xl p-1 flex gap-1">
              {(['lbs', 'kg'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setTempSettings({ ...tempSettings, units: unit })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    tempSettings.units === unit
                      ? 'bg-evolve-blue text-evolve-dark'
                      : 'text-evolve-text-muted hover:text-evolve-text'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Default Rest Time */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-evolve-text font-medium">Default Rest Time</div>
              <div className="text-evolve-text-muted text-sm">Time between sets</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTempSettings({ 
                  ...tempSettings, 
                  defaultRestTime: Math.max(60, tempSettings.defaultRestTime - 30) 
                })}
                className="w-8 h-8 bg-evolve-light-gray rounded-full flex items-center justify-center text-evolve-text hover:bg-evolve-light-gray/80 transition-colors"
              >
                -
              </button>
              <div className="min-w-[80px] text-center font-medium text-evolve-text">
                {formatTime(tempSettings.defaultRestTime)}
              </div>
              <button
                onClick={() => setTempSettings({ 
                  ...tempSettings, 
                  defaultRestTime: Math.min(600, tempSettings.defaultRestTime + 30) 
                })}
                className="w-8 h-8 bg-evolve-light-gray rounded-full flex items-center justify-center text-evolve-text hover:bg-evolve-light-gray/80 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tempSettings.soundEnabled ? (
                <Volume2 size={20} className="text-evolve-blue" />
              ) : (
                <VolumeX size={20} className="text-evolve-text-muted" />
              )}
              <div>
                <div className="text-evolve-text font-medium">Sound Effects</div>
                <div className="text-evolve-text-muted text-sm">Timer and completion sounds</div>
              </div>
            </div>
            <button
              onClick={() => setTempSettings({ ...tempSettings, soundEnabled: !tempSettings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                tempSettings.soundEnabled ? 'bg-evolve-blue' : 'bg-evolve-light-gray'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                  tempSettings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className={tempSettings.hapticEnabled ? 'text-evolve-blue' : 'text-evolve-text-muted'} />
              <div>
                <div className="text-evolve-text font-medium">Haptic Feedback</div>
                <div className="text-evolve-text-muted text-sm">Vibration on interactions</div>
              </div>
            </div>
            <button
              onClick={() => setTempSettings({ ...tempSettings, hapticEnabled: !tempSettings.hapticEnabled })}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                tempSettings.hapticEnabled ? 'bg-evolve-blue' : 'bg-evolve-light-gray'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                  tempSettings.hapticEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Changes */}
        {isEditing && (
          <div className="pt-4 border-t border-evolve-light-gray">
            <button
              onClick={handleSave}
              className="button-primary w-full flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="card space-y-4">
        <h2 className="text-xl font-bold text-evolve-text">Your Stats</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-evolve-light-gray rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-evolve-blue">{user.stats.totalWorkouts}</div>
            <div className="text-evolve-text-muted text-sm">Total Workouts</div>
          </div>
          <div className="bg-evolve-light-gray rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-evolve-green">{user.stats.personalRecords.length}</div>
            <div className="text-evolve-text-muted text-sm">Personal Records</div>
          </div>
          <div className="bg-evolve-light-gray rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-evolve-blue">{user.stats.totalSets}</div>
            <div className="text-evolve-text-muted text-sm">Total Sets</div>
          </div>
          <div className="bg-evolve-light-gray rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-evolve-green">
              {Math.round(user.stats.totalVolume).toLocaleString()}
            </div>
            <div className="text-evolve-text-muted text-sm">Total Volume</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card space-y-4 border-red-500/20 bg-red-500/5">
        <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-evolve-text font-medium">Reset All Progress</div>
              <div className="text-evolve-text-muted text-sm">
                This will delete all workouts, PRs, and return you to the Foundation session
              </div>
            </div>
            <button
              onClick={handleResetProgress}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card text-center space-y-4 bg-gradient-to-r from-evolve-blue/10 to-evolve-green/10 border-evolve-blue/20">
        <div className="text-2xl font-bold text-gradient">Evolve</div>
        <div className="text-evolve-text-muted text-sm">
          Version 1.0.0 • Built with ❤️ for strength athletes
        </div>
        <div className="text-evolve-text-muted text-sm">
          "Progressive overload made simple"
        </div>
      </div>
    </div>
  );
};

export default Settings;