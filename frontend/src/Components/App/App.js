import React from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import Content from '../Content/Content';
import Footer from '../Footer/Footer';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Content/>
      <Footer/>
    </div>
  );
}

export default App;
