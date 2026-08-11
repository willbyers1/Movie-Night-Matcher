import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RoomProvider, useRoom } from './context/RoomContext';
import { Navbar } from './components/Navbar';
import { MatchOverlay } from './components/MatchOverlay';
import { LandingPage } from './pages/LandingPage';
import { LobbyPage } from './pages/LobbyPage';
import { SwipePage } from './pages/SwipePage';
import { MatchesPage } from './pages/MatchesPage';

const AppContent: React.FC = () => {
  const { activeMatchPopup, dismissMatchPopup } = useRoom();

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1D1D1F] font-sans antialiased flex flex-col selection:bg-[#E1121D] selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/room/:roomCode" element={<LobbyPage />} />
          <Route path="/room/:roomCode/swipe" element={<SwipePage />} />
          <Route path="/room/:roomCode/matches" element={<MatchesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Synchronized "It's a Match!" celebration popup */}
      <MatchOverlay
        match={activeMatchPopup}
        onClose={dismissMatchPopup}
      />
    </div>
  );
};

export default function App() {
  return (
    <RoomProvider>
      <Router>
        <AppContent />
      </Router>
    </RoomProvider>
  );
}
