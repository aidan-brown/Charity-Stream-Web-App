import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: process.env.DDAPPID,
    clientToken: process.env.DDCLITOKEN,
    site: 'datadoghq.com',
    service: 'Minecraft-Charity-Stream',
//  env: 'production',
//  version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true
});

ReactDOM.render(<App />, document.getElementById('root'));
