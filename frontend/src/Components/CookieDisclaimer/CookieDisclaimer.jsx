import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CookieDisclaimer.scss';

const CookieDisclaimer = () => {
  const [loading, setLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('mcs-cookies-acknowledge')) setShouldShow(false);
    else setShouldShow(true);
    setLoading(false);
  }, []);

  if (loading || !shouldShow) return null;

  return (
    <span className="cookies-disclaimer">
      <p className="cookies-text">
        This website uses cookies to provide better user experience and
        functionality. You can control and configure cookies in your web browser.
        {' '}
        <Button
          className="cookie-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.rit.edu/cookie-statement"
        >
          Cookie Statement
        </Button>
        {' '}
        |
        {' '}
        <Button
          className="cookie-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.rit.edu/cookie-settings"
        >
          How to Disable Cookies
        </Button>
      </p>
      <Button
        className="acknowledge-button"
        variant="contained"
        onClick={() => {
          setShouldShow(false);
          localStorage.setItem('mcs-cookies-acknowledge', true);
        }}
      >
        Acknowledge
      </Button>
    </span>
  );
};

export default CookieDisclaimer;
