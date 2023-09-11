import React from 'react';
import './Landing.scss';
import BackgroundVideo from '../../../assets/landing-stream-clips.mp4';

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
    <video
      className="landing-backdrop-video"
      playsInline
      autoPlay
      muted
      loop
      preload="none"
      src={BackgroundVideo}
    />
  </div>
);

Landing.propTypes = {};

export default Landing;
