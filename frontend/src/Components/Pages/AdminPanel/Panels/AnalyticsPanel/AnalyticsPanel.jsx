import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { TabPanel } from '@mui/lab';
import './AnalyticsPanel.scss';
import { getUrl } from '../../../../../Utils';

const AnalyticsPanel = ({ authHeader, setAlert }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');

  const getLogs = async () => {
    try {
      const response = fetch(`${getUrl()}/analytics?${filter}`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        setAlert({
          message: 'Failed to get logs',
          severity: 'error',
        });
      } else {
        setLogs(await response.json());
      }
    } catch (_) {
      setAlert({
        message: 'Failed to toggle those items on/off',
        severity: 'error',
      });
    }
  };

  return (
    <TabPanel value="analytics">
      <div className="analytics">
        <div className="top-bar">
          <TextField
            className="search"
            variant="filled"
            placeholder="Search Logs...."
            sx={{ width: '20%' }}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            label="Search Logs.."
            value={filter}
          />
          <Button
            // className="mass-price-button"
            variant="contained"
            color="secondary"
            onClick={getLogs}
          >
            Search
          </Button>
        </div>
        <div className="content">
          {logs.map((log) => {
            <p>log</p>;
          })}
        </div>
      </div>
    </TabPanel>
  );
};

AnalyticsPanel.propTypes = {
  authHeader: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default AnalyticsPanel;
