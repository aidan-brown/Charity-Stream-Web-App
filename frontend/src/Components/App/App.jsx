import React, { useState } from 'react';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Landing from '../Pages/Landing/Landing';
import Store from '../Pages/Store/Store';
// import PlayerData from '../PlayerData';

const App = () => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="Content">
          <Switch>
            {/* <Route path="/data" component={PlayerData} /> */}
            <Route path="/store" render={() => (<Store selectedPlayer={selectedPlayer} />)} />
            <Route exact path="/" render={() => (<Landing setSelectedPlayer={setSelectedPlayer} />)} />
          </Switch>
        </main>
        <Footer />
      </div>
    </BrowserRouter>

  );
};

export default App;
