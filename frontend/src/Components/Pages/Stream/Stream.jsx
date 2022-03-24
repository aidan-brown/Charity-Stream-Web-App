import React, { useEffect, useRef, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiForum, mdiEye, mdiAccountMultiple, mdiCart,
} from '@mdi/js';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Stream.scss';
import './PlayerList.scss';
import './PerspectiveList.scss';
import StreamWindow from './StreamWindow/StreamWindow';
import StoreContent from '../Store/StoreContent/StoreContent';
import { BACKENDURL } from '../../App/constants';
import { getReq } from '../../../Utils';
import { AssociationLogos } from '../../../assets/svg';

/** Class for constructing the stream page * */
const Stream = ({ setSelectedPlayer, addItemToCart }) => {
  const streamDiv = useRef();
  const [channel, setChannel] = useState('cshba');
  const [streamWidth, setStreamWidth] = useState('100%');

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
      setStreamWidth('calc(100% - 35rem)');
      // eslint-disable-next-line no-param-reassign
      streamLists.forEach((list) => { list.className = list.className.replace('show', 'hide'); });
      // eslint-disable-next-line no-param-reassign
      streamButtons.forEach((button) => { button.className = button.className.replace('show', 'hide').replace('closed', 'open'); });
      streamList.className = streamList.className.replace('hide', 'show');
      streamButton.className = streamButton.className.replace('hide', 'show');
    } else {
      setStreamWidth('100%');
      // eslint-disable-next-line no-param-reassign
      streamButtons.forEach((button) => { button.className = button.className.replace('open', 'closed'); });
      streamList.className = streamList.className.replace('show', 'hide');
      streamButton.className = streamButton.className.replace('show', 'hide');
    }
  };

  return (
    <div className="Stream">
      <div className="stream-player bg-csh-secondary" ref={streamDiv}>
        <span className="stream-screen">
          <StreamWindow title="Charity Stream" width={streamWidth} height="100%" url={`https://player.twitch.tv/?channel=${channel}&muted=true&parent=${window.location.hostname}`} />
          <button type="button" id="perspective-button" className="stream-button bg-csh-secondary btn hide closed" onClick={toggleStreamList('perspective')}>
            <Icon path={mdiEye} className="stream-button-icon" />
          </button>
          <button type="button" id="chat-button" className="stream-button bg-csh-secondary btn hide closed" onClick={toggleStreamList('chat')}>
            <Icon path={mdiForum} className="stream-button-icon" />
          </button>
          <button type="button" id="player-button" className="stream-button bg-csh-secondary btn hide closed" onClick={toggleStreamList('player')}>
            <Icon path={mdiAccountMultiple} className="stream-button-icon" />
          </button>
          <button type="button" id="shop-button" className="stream-button bg-csh-secondary btn hide closed" onClick={toggleStreamList('shop')}>
            <Icon path={mdiCart} className="stream-button-icon" />
          </button>
        </span>
        <div id="perspective-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Perspectives</h4>
          <PerspectiveList setChannel={setChannel} />
        </div>
        <div id="chat-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Stream Chat</h4>
          <iframe
            src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}`}
            height="100%"
            width="100%"
            title="Stream Chat"
          />
        </div>
        <div id="player-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Players</h4>
          <PlayerList setSelectedPlayer={setSelectedPlayer} />
        </div>
        <div id="shop-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Quick Buy</h4>
          <StoreContent className="StreamList" filterTag="all" addItemToCart={addItemToCart} />
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
    'MysticatLive',
    'samanthiiana',
    'Dantayy5050',
    'dawnshadowx3',
    'bohchoi',
    'skeleton_weeb',
    'laqqy',
    'cahriid',
    'lumiinara',
    'clipsothealien',
    'roxkstar74',
  ];

  return (
    <ul className="PerspectiveList StreamList">
      {channels.map((channelName) => (
        <button type="button" className="perspective-button" onClick={() => setChannel(channelName)} key={channelName}>
          <span className="perspective-overlay" />
          <span className="perspective-title">{channelName.toUpperCase()}</span>
          <img src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-440x248.jpg`} alt={channelName} />
        </button>
      ))}
    </ul>
  );
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
      }).map((player) => {
        const Logo = AssociationLogos[player.association.toUpperCase()];
        return (
          <Link key={player.username} className={`list-element ${player.association.toLowerCase()}`} onClick={() => playerOnClick(player)} to="/Store">
            <p>{`${player.name} [${player.username}]`}</p>
            <Logo className="team-logo" />
            <Icon path={mdiCart} className="shop-logo" />
          </Link>
        );
      })}
    </ul>
  );
};

Stream.propTypes = {
  setSelectedPlayer: PropTypes.func.isRequired,
  addItemToCart: PropTypes.func.isRequired,
};

PlayerList.propTypes = {
  setSelectedPlayer: PropTypes.func.isRequired,
};

PerspectiveList.propTypes = {
  setChannel: PropTypes.func.isRequired,
};

export default Stream;
