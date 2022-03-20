import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PlayerList.css';
import { BACKENDURL } from '../../../App/constants';
import {getReq} from '../../../../Utils'

import cshLogo from '../../../../images/csh.svg';
import blackbaudLogo from '../../../../images/blackbaud.svg';
import hogsLogo from '../../../../images/hogs.svg';
import ehouseLogo from '../../../../images/ehouse.svg';
import sseLogo from '../../../../images/sse.svg';
import arthouseLogo from '../../../../images/arthouse.svg';
import ritLogo from '../../../../images/rit.svg';
import CartLogo from '../../../../images/shopping-cart.svg';

const logos = {
  cshLogo,
  blackbaudLogo,
  hogsLogo,
  ehouseLogo,
  sseLogo,
  arthouseLogo,
  ritLogo,
};

/** Class for constructing the player list component * */
const PlayerList = ({ setSelectedPlayer }) => {
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    getReq(`${BACKENDURL}/players`)
      .then((res) => res.json())
      .then((res) => {
        setPlayerList(res);
      })
      .catch(() => {});
  }, []);

  const playerOnClick = (player) => {
    setSelectedPlayer(player.username);
    document.querySelector('.Navbar .active').className = 'nav-link';
    document.querySelector('#store').className = 'nav-link active';
  };

  return (
    <ul className="PlayerList">
      {playerList.sort((a, b) => {
        if (a.type > b.type) {
          return 1;
        } if (a.type < b.type) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }).map((player) => (
        <Link key={player.username} className={`list-element ${player.type.toLowerCase()}`} onClick={() => playerOnClick(player)} to="/Store">
          <p>{`${player.name} [${player.username}]`}</p>
          <img src={logos[`${player.type.toLowerCase()}Logo`]} alt={`${player.type} Logo`} className="team-logo" />
          <img src={CartLogo} alt="Shop logo" className="shop-logo" />
        </Link>
      ))}
    </ul>
  );
};

PlayerList.propTypes = {
  setSelectedPlayer: PropTypes.func.isRequired,
};

export default PlayerList;
