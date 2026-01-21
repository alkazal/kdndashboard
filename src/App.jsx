import { useState } from 'react';
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import KajianOverview from "./pages/KajianOverview";
import PenguatkuasaanOverview from "./pages/PenguatkuasaanOverview";
import PNPOverview from "./pages/PNPOverview";
import Login from "./pages/Login";

export default function App() {
  const [currentPage, setCurrentPage] = useState('penguatkuasaan');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  if (!isLoggedIn || currentPage === 'login') {
    return (
      <Login
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setCurrentPage('penguatkuasaan');
        }}
      />
    );
  }

  return currentPage === 'overview' ? 
    <Overview currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} /> : 
    currentPage === 'analytics' ?
    <Analytics currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} /> :
    currentPage === 'kajian' ?
    <KajianOverview currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} /> :
    currentPage === 'penguatkuasaan' ?
    <PenguatkuasaanOverview currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} /> :
    currentPage === 'pnp' ?
    <PNPOverview currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} /> :
    <KajianOverview currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />;
}