import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { datadogRum } from '@datadog/browser-rum';
import App from './Components/App/App';
import './index.css';

/* eslint-disable no-underscore-dangle */
if (process.env.NODE_ENV === 'production') {
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
}
/* eslint-enable no-underscore-dangle */

// Set up Query Client for all API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

/* eslint-disable react/jsx-filename-extension */
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
);
/* eslint-enable react/jsx-filename-extension */
