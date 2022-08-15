import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
});

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('root'),
);
/* eslint-enable react/jsx-filename-extension */
