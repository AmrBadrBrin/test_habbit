import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import Home from './pages/Home';
import Habits from './pages/Habits';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

function App() {
  useEffect(() => {
    // Initialize Telegram Mini App
    WebApp.ready();
    WebApp.expand();

    // Apply Telegram theme colors
    if (WebApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
