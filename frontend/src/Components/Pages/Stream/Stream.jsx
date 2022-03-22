import React, { useEffect, useRef, useState } from 'react';
import Icon from '@mdi/react';
import { mdiForum, mdiEye, mdiAccountMultiple } from '@mdi/js';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Stream.css';
import './PlayerList.css';
import './PerspectiveList.css';
import StreamWindow from './StreamWindow/StreamWindow';
import { BACKENDURL } from '../../App/constants';
import { getReq } from '../../../Utils';
import {
  CSHLogo, BlackbaudLogo, HOGSLogo, EhouseLogo, SSELogo, ArthouseLogo, RITLogo, ShoppingCart,
} from '../../../images/svg';

/** Class for constructing the stream page * */
const Stream = ({ setSelectedPlayer }) => {
  const streamDiv = useRef();
  const [channel, setChannel] = useState('cshba');

  useEffect(() => {
    streamDiv.current.style.height = `${window.screen.height * 0.75}px`;
  }, []);

  /*
    Handles the toggling of the player list, changing the
    class name of the list and arrow to the appropriate state
    */
  const toggleStreamList = (streamListId) => () => {
    const streamList = document.querySelector(`#${streamListId}-list`);
    const streamButton = document.querySelector(`#${streamListId}-button`);
    const streamLists = document.querySelectorAll('.stream-list');
    const streamButtons = document.querySelectorAll('.stream-button');
    if (streamList.className.includes('hide')) {
      // eslint-disable-next-line no-param-reassign
      streamLists.forEach((list) => { list.className = list.className.replace('show', 'hide'); });
      // eslint-disable-next-line no-param-reassign
      streamButtons.forEach((button) => { button.className = button.className.replace('show', 'hide'); });
      streamList.className = streamList.className.replace('hide', 'show');
      streamButton.className = streamButton.className.replace('hide', 'show');
    } else {
      streamList.className = streamList.className.replace('show', 'hide');
      streamButton.className = streamButton.className.replace('show', 'hide');
    }
  };

  return (
    <div className="Stream">
      <div className="stream-player" ref={streamDiv}>
        <span>
          <StreamWindow title="Charity Stream" width="100%" height="100%" url={`https://player.twitch.tv/?channel=${channel}&muted=true&parent=${window.location.hostname}`} />
          <button type="button" id="perspective-button" className="stream-button btn hide" onClick={toggleStreamList('perspective')}>
            <Icon path={mdiEye} className="stream-button-icon" />
          </button>
          <button type="button" id="chat-button" className="stream-button btn hide" onClick={toggleStreamList('chat')}>
            <Icon path={mdiForum} className="stream-button-icon" />
          </button>
          <button type="button" id="player-button" className="stream-button btn hide" onClick={toggleStreamList('player')}>
            <Icon path={mdiAccountMultiple} className="stream-button-icon" />
          </button>
        </span>
        <div id="perspective-list" className="stream-list hide">
          <PerspectiveList setChannel={setChannel} />
        </div>
        <div id="chat-list" className="stream-list hide">
          <iframe
            src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}`}
            height="100%"
            width="100%"
            title="Stream Chat"
          />
        </div>
        <div id="player-list" className="stream-list hide">
          <PlayerList setSelectedPlayer={setSelectedPlayer} />
        </div>
      </div>

      <div className="stream-row">
        <iframe id="dynmap-frame" className="stream-row-item" title="Dynmap" src="http://dionysus.csh.rit.edu:8123/" />
        <article id="flavor-text" className="stream-row-item bg-csh-secondary-gradient">
          <h2>About the Stream</h2>
          <p>
            CSH&apos;s annual Minecraft Charity Stream is a large-scale competition
            between players in a series of minigames, with all donations
            and money earned during the stream going to charity.
          </p>
          <p>
            The competition comes with a twist: viewer donations can provide
            items, cause mob spawns, or apply potion effects to drastically
            change the course of the game!
          </p>
          <p>
            Check out the stream above or on our
            <a href="https://www.twitch.tv/cshba"> Twitch </a>
            and if you&apos;d like to donate, head to our store above to influence the tournament.
          </p>
        </article>
      </div>
    </div>
  );
};

const PerspectiveList = ({ setChannel }) => {
  const channels = [
    'cshba',
    'dawnshadowx3',
    'nihachu',
    'lilypichu',
  ];

  return (
    <ul className="PerspectiveList StreamList">
      <h4>Perspectives</h4>
      {channels.map((channelName, index) => (
        <button type="button" className="perspective-button" onClick={() => setChannel(channelName)}>
          <span className="perspective-overlay" />
          <span className="perspective-title">{channelName.toUpperCase()}</span>
          <img src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-440x248.jpg`} alt={channelName} key={index} />
        </button>
      ))}
    </ul>
  );
};

const logos = {
  CSHLogo,
  BlackbaudLogo,
  HOGSLogo,
  EhouseLogo,
  SSELogo,
  ArthouseLogo,
  RITLogo,
};

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
    <ul className="PlayerList StreamList">
      <h4>Players</h4>
      {playerList.sort((a, b) => {
        if (a.association > b.association) {
          return 1;
        } if (a.association < b.association) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }).map((player) => (
        <Link key={player.username} className={`list-element ${player.association.toLowerCase()}`} onClick={() => playerOnClick(player)} to="/Store">
          <p>{`${player.name} [${player.username}]`}</p>
          <img src={logos[`${player.association.toLowerCase()}Logo`]} alt={`${player.association} Logo`} className="team-logo" />
          <img src={ShoppingCart} alt="Shop logo" className="shop-logo" />
        </Link>
      ))}
    </ul>
  );
};

Stream.propTypes = {
  setSelectedPlayer: PropTypes.func.isRequired,
};

PlayerList.propTypes = {
  setSelectedPlayer: PropTypes.func.isRequired,
};

PerspectiveList.propTypes = {
  setChannel: PropTypes.func.isRequired,
};

export default Stream;