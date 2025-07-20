import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, TrendingUp, Settings, Dumbbell } from 'lucide-react';
import { useAppStore } from '../store';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { currentWorkout } = useAppStore();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/workout', icon: Dumbbell, label: 'Workout' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-evolve-dark flex flex-col">
      {/* Header */}
      <header className="glass-effect border-b border-evolve-light-gray/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Evolve</h1>
          {currentWorkout && (
            <div className="flex items-center gap-2 text-evolve-green text-sm font-medium">
              <div className="w-2 h-2 bg-evolve-green rounded-full animate-pulse"></div>
              Workout Active
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-effect border-t border-evolve-light-gray/30 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-around">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-evolve-blue bg-evolve-blue/10'
                      : 'text-evolve-text-muted hover:text-evolve-text hover:bg-evolve-light-gray/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;