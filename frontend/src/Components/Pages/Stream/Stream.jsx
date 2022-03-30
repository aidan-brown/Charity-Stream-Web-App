import React, { useEffect, useRef, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiForum,
  mdiEye,
  mdiAccountMultiple,
  mdiCart,
  mdiFlask,
  mdiFoodDrumstick,
  mdiPickaxe,
  mdiSack,
  mdiScriptText,
  mdiShield,
  mdiSkull,
  mdiSwordCross,
  mdiWizardHat,
} from '@mdi/js';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import './Stream.scss';
import './PlayerList.scss';
import './PerspectiveList.scss';
import StreamWindow from './StreamWindow/StreamWindow';
import StoreContent from '../Store/StoreContent/StoreContent';
import { getUrl, getReq } from '../../../Utils';
import AssociationLogos from '../../../assets';

/** Class for constructing the stream page * */
const Stream = ({ setSelectedPlayer, addItemToCart }) => {
  const streamDiv = useRef();
  const [channel, setChannel] = useState('cshba');
  const [streamWidth, setStreamWidth] = useState('100%');
  const [playerList, setPlayerList] = useState([]);
  const [filterTag, setFilterTag] = useState('all');

  useEffect(() => {
    getReq(`${getUrl()}/players`)
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

  /*
    Handles the toggling of the player list, changing the
    class name of the list and arrow to the appropriate state
    */
  const toggleStreamList = (streamListId) => () => {
    const streamList = document.querySelector(`#${streamListId}-list`);
    const streamButton = document.querySelector(`#${streamListId}-button`);
    const streamLists = document.querySelectorAll('.stream-list');
    const streamButtons = document.querySelectorAll('.stream-buttons .stream-button');
    const streamButtonsSpan = document.querySelector('.stream-buttons');
    if (streamList.className.includes('hide')) {
      setStreamWidth('calc(100% - 35rem)');
      // eslint-disable-next-line no-param-reassign
      streamLists.forEach((list) => { list.className = list.className.replace('show', 'hide'); });
      // eslint-disable-next-line no-param-reassign
      streamButtons.forEach((button) => { button.className = button.className.replace('show', 'hide'); });
      streamButtonsSpan.className = streamButtonsSpan.className.replace('closed', 'open');
      streamDiv.current.className = streamDiv.current.className.replace('closed', 'open');
      streamList.className = streamList.className.replace('hide', 'show');
      streamButton.className = streamButton.className.replace('hide', 'show');
    } else {
      setStreamWidth('100%');
      // eslint-disable-next-line no-param-reassign
      streamButtonsSpan.className = streamButtonsSpan.className.replace('open', 'closed');
      streamDiv.current.className = streamDiv.current.className.replace('open', 'closed');
      streamList.className = streamList.className.replace('show', 'hide');
      streamButton.className = streamButton.className.replace('show', 'hide');
    }
  };

  const handleQuickBuyFilters = (filter) => () => {
    setFilterTag(filter);
    const btn = document.querySelector(`.quick-store-nav #store-${filter}`);
    // eslint-disable-next-line no-param-reassign
    document.querySelectorAll('.quick-store-nav .stream-button').forEach((button) => { button.className = button.className.replace('show', 'hide'); });
    btn.className = btn.className.replace('hide', 'show');
  };

  const PerspectiveList = () => (
    <ul className="PerspectiveList StreamList">
      {[{ association: 'streamer', channel: 'cshba' }, ...playerList].filter((a) => a.association === 'streamer').map((player) => {
        const channelName = player.channel;
        return (
          <button type="button" className="perspective-button" onClick={() => setChannel(channelName)} key={channelName}>
            <span className="perspective-overlay" />
            <span className="perspective-title">{channelName.toUpperCase()}</span>
            <img src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-440x248.jpg`} alt={channelName} />
          </button>
        );
      })}
    </ul>
  );

  const PlayerList = () => (
    <ul className="PlayerList StreamList">
      {playerList.sort((a, b) => b.association.localeCompare(a.association)).map((player) => {
        const playerAssociation = player.association === 'streamer' && player.channel.toUpperCase() in AssociationLogos
          ? player.channel
          : player.association;
        const Logo = playerAssociation.toUpperCase() in AssociationLogos
          ? AssociationLogos[playerAssociation.toUpperCase()]
          : AssociationLogos.RIT;
        return (
          <Link key={player.username} className={`list-element ${playerAssociation}`} onClick={() => playerOnClick(player)} to="/Store">
            <p>{`${player.name} [${player.username}]`}</p>
            <Logo className="team-logo" />
            <Icon path={mdiCart} className="shop-logo" />
          </Link>
        );
      })}
    </ul>
  );

  return (
    <div className="Stream">
      <div className="stream-player bg-csh-secondary closed" ref={streamDiv}>
        <span className="stream-screen">
          <StreamWindow title="Charity Stream" width={streamWidth} height="100%" url={`https://player.twitch.tv/?channel=${channel}&muted=true&parent=${window.location.hostname}`} />
          <span className="stream-buttons closed">
            <button type="button" id="perspective-button" className="stream-button bg-csh-secondary btn hide" onClick={toggleStreamList('perspective')}>
              <Icon path={mdiEye} className="stream-button-icon" />
            </button>
            <button type="button" id="chat-button" className="stream-button bg-csh-secondary btn hide" onClick={toggleStreamList('chat')}>
              <Icon path={mdiForum} className="stream-button-icon" />
            </button>
            <button type="button" id="player-button" className="stream-button bg-csh-secondary btn hide" onClick={toggleStreamList('player')}>
              <Icon path={mdiAccountMultiple} className="stream-button-icon" />
            </button>
            <button type="button" id="shop-button" className="stream-button bg-csh-secondary btn hide" onClick={toggleStreamList('shop')}>
              <Icon path={mdiCart} className="stream-button-icon" />
            </button>
          </span>
        </span>
        <div id="perspective-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Perspectives</h4>
          {PerspectiveList()}
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
          {PlayerList()}
        </div>
        <div id="shop-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Quick Buy</h4>
          <div className="StreamList">
            <StoreContent filterTag={filterTag} addItemToCart={addItemToCart} />
            <nav className="quick-store-nav bg-csh-secondary">
              <button type="button" id="store-all" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('all')} onClick={handleQuickBuyFilters('all')}>
                <Icon path={mdiScriptText} className="stream-button-icon" />
              </button>
              <button type="button" id="store-tool" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('tool')} onClick={handleQuickBuyFilters('tool')}>
                <Icon path={mdiPickaxe} className="stream-button-icon" />
              </button>
              <button type="button" id="store-weapon" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('weapon')} onClick={handleQuickBuyFilters('weapon')}>
                <Icon path={mdiSwordCross} className="stream-button-icon" />
              </button>
              <button type="button" id="store-armor" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('armor')} onClick={handleQuickBuyFilters('armor')}>
                <Icon path={mdiShield} className="stream-button-icon" />
              </button>
              <button type="button" id="store-food" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('food')} onClick={handleQuickBuyFilters('food')}>
                <Icon path={mdiFoodDrumstick} className="stream-button-icon" />
              </button>
              <button type="button" id="store-material" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('material')} onClick={handleQuickBuyFilters('material')}>
                <Icon path={mdiSack} className="stream-button-icon" />
              </button>
              <button type="button" id="store-effects" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('effects')} onClick={handleQuickBuyFilters('effects')}>
                <Icon path={mdiWizardHat} className="stream-button-icon" />
              </button>
              <button type="button" id="store-mobs" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('mobs')} onClick={handleQuickBuyFilters('mobs')}>
                <Icon path={mdiSkull} className="stream-button-icon" />
              </button>
              <button type="button" id="store-misc" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('misc')} onClick={handleQuickBuyFilters('misc')}>
                <Icon path={mdiFlask} className="stream-button-icon" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      <h2 className="stream-row-title row-reverse">About the Stream</h2>
      <div className="stream-row row-reverse">
        <iframe className="stream-row-item stream-row-iframe" title="Dynmap" src="https://dionysus.csh.rit.edu" />
        <article className="stream-row-item stream-row-text-box bg-csh-secondary-gradient">
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
      <h2 className="stream-row-title">About the Hub World</h2>
      <div className="stream-row">
        <iframe
          className="stream-row-item stream-row-iframe"
          src="https://www.youtube.com/embed/PU6Bopb1CVE"
          title="CSH Hub World"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <article className="stream-row-item stream-row-text-box bg-csh-secondary-gradient">
          <p>
            Over the past couple of months, members and friends of CSH gathered together
            to create a hub world for our stream! They have put in countless hours creating
            fantastical builds that help entertain our players in between games.
          </p>
          <p>
            From the large silhouette of a grand volcano in the North to the quaint cottagecore
            village in the South, our builders put in a lot of work making everything pretty.
          </p>
          <p>
            Not in the server? You can still see some of the amazing builds by watching this video!
          </p>
        </article>
      </div>
    </div>
  );
};

Stream.propTypes = {
  setSelectedPlayer: PropTypes.func.isRequired,
  addItemToCart: PropTypes.func.isRequired,
};

export default Stream;
