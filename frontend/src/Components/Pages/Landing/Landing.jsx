import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Landing.scss';
import BackgroundVideo from '../../../assets/landing-stream-clips.mp4';
import { msToTime } from '../../../Utils';

const Landing = ({ setStreamStarted }) => {
  const streamYear = '5th';
  const streamDate = new Date('April 8, 2023 23:00:00 UTC');
  const [remainingTime, setRemainingTime] = useState(streamDate - Date.now());

  setTimeout(() => {
    setRemainingTime(streamDate.getTime() - Date.now());
    if (remainingTime <= 0) setStreamStarted(true);
  }, 1000);

  return (
    <div className="Landing">
      <span className="landing-box">
        <h2 className="landing-presents">Computer Science House Presents:</h2>
        <h1 className="landing-title">
          {`The ${streamYear} Annual`}
          <br />
          Charity Stream
        </h1>
        <p className="landing-countdown">{msToTime(remainingTime)}</p>
      </span>
      <span className="landing-overlay" />
      <video className="landing-backdrop-video" playsInline autoPlay muted loop preload="none" src={BackgroundVideo} />
    </div>
  );
};

Landing.propTypes = {
  setStreamStarted: PropTypes.func.isRequired,
};

export default Landing;
