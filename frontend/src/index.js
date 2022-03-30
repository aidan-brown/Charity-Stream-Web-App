import React from 'react';
import ReactDOM from 'react-dom';
import { datadogRum } from '@datadog/browser-rum-recorder';
import App from './Components/App/App';
import './index.css';

/* eslint-disable no-underscore-dangle */
datadogRum.init({
  applicationId: window._env_.DDAPPID,
  clientToken: window._env_.DDCLITOKEN,
  site: 'datadoghq.com',
  service: 'Minecraft-Charity-Stream',
  env: 'production',
  version: '1.0.0',
  sampleRate: 100,
  trackInteractions: true,
});
/* eslint-enable no-underscore-dangle */

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));
