import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Tab,
} from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AnalyticsPanel, CommandsPanel, ItemUpdatePanel, PlayerManagePanel,
} from './Panels';
import useAccount from '../../../hooks';
import './AdminPanel.scss';
import Loading from '../Loading';

const AdminPanel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { account, isLoading } = useAccount();

  const [alert, setAlert] = useState();
  const [tab, setTab] = useState(searchParams.get('tab') || 'quick-commands');

  useEffect(() => navigate(`/admin-panel?tab=${tab}`), [tab]);
  useEffect(() => {
    if (!isLoading && account?.role !== 'ADMIN') {
      navigate('/');
    }
  }, [account, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box className="admin-panel" sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={(_, newValue) => setTab(newValue)}
            aria-label="Admin Panel Tabs"
          >
            <Tab label="Quick Commands" value="quick-commands" />
            <Tab label="Update Items" value="update-items" />
            <Tab label="Players" value="players" />
            <Tab label="Analytics" value="analytics" />
          </TabList>
        </Box>
        {alert && (
        <Alert
          className="admin-alert"
          onClose={() => setAlert()}
          variant="filled"
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
        )}
        <CommandsPanel setAlert={setAlert} />
        <ItemUpdatePanel setAlert={setAlert} />
        <PlayerManagePanel setAlert={setAlert} />
        <AnalyticsPanel setAlert={setAlert} />
      </TabContext>
    </Box>
  );
};

export default AdminPanel;
