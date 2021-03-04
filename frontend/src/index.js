import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import * as serviceWorker from './serviceWorker';
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
