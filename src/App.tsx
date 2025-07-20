import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { useTimer } from './hooks/useTimer';
import { useEffect } from 'react';

// Pages
import Dashboard from './pages/Dashboard';
import Foundation from './pages/Foundation';
import Workout from './pages/Workout';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';
import Timer from './components/Timer';

function App() {
  const { user } = useAppStore();
  const { requestNotificationPermission } = useTimer();

  useEffect(() => {
    // Request notification permission on app load
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // If user is not onboarded, redirect to foundation
  if (user && !user.isOnboarded) {
    return (
      <Routes>
        <Route path="/foundation" element={<Foundation />} />
        <Route path="*" element={<Navigate to="/foundation" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Timer />
    </Layout>
  );
}

export default App;