import { useState } from 'react';
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import KajianOverview from "./pages/KajianOverview";
import PenguatkuasaanOverview from "./pages/PenguatkuasaanOverview";
import PNPOverview from "./pages/PNPOverview";

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');

  return currentPage === 'overview' ? 
    <Overview currentPage={currentPage} setCurrentPage={setCurrentPage} /> : 
    currentPage === 'analytics' ?
    <Analytics currentPage={currentPage} setCurrentPage={setCurrentPage} /> :
    currentPage === 'kajian' ?
    <KajianOverview currentPage={currentPage} setCurrentPage={setCurrentPage} /> :
    currentPage === 'penguatkuasaan' ?
    <PenguatkuasaanOverview currentPage={currentPage} setCurrentPage={setCurrentPage} /> :
    currentPage === 'pnp' ?
    <PNPOverview currentPage={currentPage} setCurrentPage={setCurrentPage} /> :
    <KajianOverview currentPage={currentPage} setCurrentPage={setCurrentPage} />;
}