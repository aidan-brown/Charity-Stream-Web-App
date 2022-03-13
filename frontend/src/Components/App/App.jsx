import React, { useState } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Landing from '../Pages/Landing/Landing';
import Store from '../Pages/Store/Store';
import AdminPanel from '../Pages/AdminPanel';
// import PlayerData from '../PlayerData';

const App = () => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="Content">
          <Routes>
            {/* <Route path="/data" component={PlayerData} /> */}
            <Route path="/store" element={<Store selectedPlayer={selectedPlayer} />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route exact path="/" element={<Landing setSelectedPlayer={setSelectedPlayer} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
