import React from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import Content from '../Content/Content';
import Footer from '../Footer/Footer';
import {BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Content/>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
