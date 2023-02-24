import { CircularProgress } from '@mui/material';
import React from 'react';
import './Loading.scss';

const Loading = () => (
  <div className="loading-page">
    <CircularProgress size={100} />
    <h1 className="heading">Loading...</h1>
  </div>
);

export default Loading;
