import { useEffect, useState } from 'react';
import BackgroundGlow from './components/BackgroundGlow.jsx';
import AppFooter from './components/AppFooter.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import Tabs from './components/Tabs.jsx';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('ical_current_user');
    if (raw) setCurrentUser(JSON.parse(raw));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 text-slate-800 relative">
      <BackgroundGlow />
      {!currentUser ? (
        <AuthScreen onAuthenticated={setCurrentUser} />
      ) : (
        <Tabs user={currentUser} onSignOut={() => {
          localStorage.removeItem('ical_current_user');
          setCurrentUser(null);
        }} />
      )}
      <AppFooter />
    </div>
  );
}

export default App;
