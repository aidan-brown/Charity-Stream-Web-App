import React from 'react';
import PropTypes from 'prop-types';
import './Landing.scss';
import BackgroundVideo from '../../../assets/landing-stream-clips.mp4';

const Landing = ({ countdown }) => {
  const streamYear = '4th';

  return (
    <div className="Landing">
      <span className="landing-box">
        <h2 className="landing-presents">Computer Science House Presents:</h2>
        <h1 className="landing-title">
          {`The ${streamYear} Annual`}
          <br />
          Charity Stream
        </h1>
        <p className="landing-countdown">{countdown}</p>
      </span>
      <span className="landing-overlay" />
      <video className="landing-backdrop-video" playsInline autoPlay muted loop preload="none" src={BackgroundVideo} />
    </div>
  );
};

Landing.propTypes = {
  countdown: PropTypes.string.isRequired,
};

export default Landing;
