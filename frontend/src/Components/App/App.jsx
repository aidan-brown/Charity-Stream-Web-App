import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import {
  Stream, Store, AdminPanel, Landing,
} from '../Pages';
import { msToTime } from '../../Utils';
// import PlayerData from '../PlayerData';

const App = () => {
  const streamDate = new Date('April 8, 2022 19:00:00');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [remainingTime, setRemainingTime] = useState(streamDate - Date.now());

  useEffect(() => {
    setTimeout(() => {
      setRemainingTime(streamDate - Date.now());
    }, 1000);
  });

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar remainingTime={remainingTime} />
        <main className="Content">
          <Routes>
            <Route path="/store" element={<Store selectedPlayer={selectedPlayer} />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route exact path="/stream" element={<Stream setSelectedPlayer={setSelectedPlayer} />} />
            <Route exact path="/" element={remainingTime > 0 ? <Landing countdown={msToTime(remainingTime)} /> : <Stream setSelectedPlayer={setSelectedPlayer} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
