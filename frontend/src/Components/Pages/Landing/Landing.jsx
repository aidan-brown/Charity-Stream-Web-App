import React from 'react';
import './Landing.scss';

const Landing = () => (
  <div className="Landing">
    <span className="landing-box">
      <h2 className="landing-presents">Computer Science House Presents:</h2>
      <h1 className="landing-title">
        The 2023 Annual
        <br />
        Charity Stream
      </h1>
    </span>
    <span className="landing-overlay" />
  </div>
);

Landing.propTypes = {};

export default Landing;
