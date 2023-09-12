import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import App from './Components/App/App';
import './index.css';

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
