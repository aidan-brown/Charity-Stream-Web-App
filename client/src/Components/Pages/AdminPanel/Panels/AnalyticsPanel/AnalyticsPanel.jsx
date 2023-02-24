import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { TabPanel } from '@mui/lab';
import './AnalyticsPanel.scss';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../../../../../api';

const AnalyticsPanel = ({ setAlert }) => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');

  const getLogs = async () => {
    try {
      const newLogs = await getAnalytics(filter);

      if (!newLogs) {
        setAlert({
          message: 'Failed to get logs',
          severity: 'error',
        });
      } else {
        setLogs(newLogs);
      }
    } catch (err) {
      if (err === 'REDIRECT_TO_LOGIN') {
        navigate('/login');
      }
    }
  };

  return (
    <TabPanel value="analytics">
      <div className="analytics">
        <div className="top-bar">
          <div className="search-bar">
            <TextField
              className="search"
              variant="filled"
              placeholder="Search Logs...."
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              label="Search Logs.."
              value={filter}
            />
            <Button
              className="search-button"
              variant="contained"
              color="secondary"
              onClick={getLogs}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="content">
          {logs.length === 0 && (
            <h1>Nothing to see here (no logs)</h1>
          )}
          <div>
            {logs.map(({
              type, message, code, additional,
            }) => (
              <p>
                {type}
                [
                {code}
                ]:
                {' '}
                {message}
                {' '}
                {additional}
              </p>
            ))}
          </div>
        </div>
      </div>
    </TabPanel>
  );
};

AnalyticsPanel.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default AnalyticsPanel;
