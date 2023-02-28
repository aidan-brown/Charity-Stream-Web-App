import React, { useEffect, useState } from 'react';
import {
  Link, Navigate, useNavigate, useSearchParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Button, CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import AssociationLogos from '../../assets';
import { Toggler } from '../../assets/svg';
import useAccount from '../../hooks';
import { logoutAccount } from '../../api';
import './Navbar.scss';
import '../Bootstrap-Colors/palette.scss';

/** Class for constructing the main navbar of the page * */
const Navbar = ({ streamStarted }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { account, isLoading, isError } = useAccount();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isAdmin = account?.role === 'ADMIN';
  const isLoginTest = searchParams.get('loginTest');

  useEffect(() => {
    let activeLink;
    switch (window.location.pathname) {
      case '/':
        if (streamStarted) {
          activeLink = document?.querySelector('#stream');
        }
        break;

      default:
        if (window.location.pathname.split('/').length <= 2) {
          activeLink = document
            ?.querySelector(`#${window.location.pathname
              .substring(1, window.location.pathname.length).toLowerCase()}`);
        }
        break;
    }

    if (activeLink) {
      activeLink.className += ' active';
    }
  }, []);

  if (isError && isLoginTest) {
    return <Navigate to="/login" />;
  }

  /*
    Handles setting the active link on the navbar
    */
  const setLinkActive = (event) => {
    document.querySelector('.Navbar .active').className = 'nav-link';
    if (event.target.className.includes('navbar-brand') && streamStarted) {
      document.querySelector('#stream').className = 'nav-link active';
    }
    /* eslint-disable no-param-reassign */
    if (event.target.className === 'nav-link' || event.target.className === 'nav-link active') {
      event.target.className = 'nav-link active';
    } else {
      event.target.parentNode.className = 'nav-link active';
    }
    /* eslint-enable no-param-reassign */
  };

  return (
    <nav className="Navbar">
      <div className="navbar navbar-expand-md bg-csh-primary-gradient">
        <Link className="navbar-brand order-md-first" onClick={setLinkActive} to="/" rel="noopener noreferrer">
          <AssociationLogos.CSH id="csh-logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <Toggler id="toggler" />
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link id="stream" className="nav-link" onClick={setLinkActive} to="/stream"><span>Stream</span></Link>
            </li>
            <li className="nav-item">
              <Link id="store" className="nav-link" onClick={setLinkActive} to="/store"><span>Donation Shop</span></Link>
            </li>
            <li className="nav-item">
              <a id="learn-more" className="nav-link" href="https://www.justgiving.com/fundraising/csh-charity" target="_blank" rel="noopener noreferrer"><span>Learn More</span></a>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link id="admin-panel" className="nav-link" onClick={setLinkActive} to="/admin-panel"><span>Admin Panel</span></Link>
              </li>
            )}
          </ul>
        </div>
        {isLoginTest && (
        <>
          {isLoading && <CircularProgress />}
          {!isLoading && (
          <>
            {account && (
            <button
              type="button"
              className="account"
              onClick={() => {
                setIsPopoverOpen(!isPopoverOpen);
              }}
            >
              <p className="name">
                {account.name || 'Account'}
              </p>
              <Avatar
                alt={account.name || 'Account'}
                src={account.picture}
                referrerPolicy="no-referrer"
              />
            </button>
            )}
            {!account && (
            <Button variant="contained" href="/login">
              Login
            </Button>
            )}
          </>
          )}
        </>
        )}
      </div>
      {isPopoverOpen && (
        <div className="navbar-account-popover">
          <Button
            variant="contained"
            onClick={async () => {
              await logoutAccount();
              setIsPopoverOpen(false);
              queryClient.removeQueries(['account']);
              navigate('/');
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  streamStarted: PropTypes.bool.isRequired,
};

export default Navbar;
