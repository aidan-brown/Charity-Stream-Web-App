import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import useAccount from '../../../hooks';
import './AdminPanel.scss';
import Loading from '../Loading';
import Dashboard from './Panels/Dashboard';

const PANELS = ['Dashboard', 'Players', 'Commands', 'Items'];

const AdminPanel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { account, isLoading } = useAccount();

  const tab = searchParams.get('tab') || 'Dashboard';

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
    <div className="admin-panel">
      <div className="nav-container">
        <ul>
          {PANELS.map((panel) => (
            <li key={panel} className={tab === panel ? 'link-active' : ''}>
              <Link
                id={panel}
                to={`/admin-panel?tab=${panel}`}
              >
                {panel}
              </Link>
            </li>
          ))}
        </ul>
        <FormControlLabel
          value="start"
          control={<Switch color="primary" />}
          label="Checkout Disabled"
          labelPlacement="start"
        />
      </div>
      <div>
        {tab === 'Dashboard' && (
          <Dashboard />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
