/* eslint-disable react/forbid-prop-types */
import React, { Fragment, useRef, useState } from 'react';
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
import { Popover } from '@mui/material';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import StreamWindow from './StreamWindow/StreamWindow';
import StoreContent from '../Store/StoreContent/StoreContent';
import { getApiUrl, ItemSymbols } from '../../../Utils';
import AssociationLogos from '../../../assets';
import BackgroundVideo from '../../../assets/landing-stream-clips.mp4';
import { steveFace } from '../../../assets/images';
import { getPlayers, getDynmapData } from '../../../api';
import './Stream.scss';
import './PlayerList.scss';
import './PerspectiveList.scss';

/** Class for constructing the stream page * */
const Stream = ({
  setSelectedPlayer, addItemToCart, cartItems, setCartItems,
}) => {
  const streamDiv = useRef();
  const [channel, setChannel] = useState('cshba');
  const [streamWidth, setStreamWidth] = useState('100%');
  const [filterTag, setFilterTag] = useState('ALL');

  const { data: playerList = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => getPlayers(),
  });

  const { data: playerData = {} } = useQuery({
    queryKey: ['dynmap-data'],
    queryFn: () => getDynmapData(),
    refetchInterval: 5000,
  });

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
      {[{ association: 'streamer', channel: 'cshba' }, ...playerList].filter((a) => a.channel).map((player) => {
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

  const PlayerList = () => {
    const [anchorEls, setAnchorEls] = useState({});
    let openPopovers = [];

    const handlePopoverClose = (playerName) => () => {
      setAnchorEls({ ...anchorEls, [playerName]: null });
    };

    const handlePopoverOpen = (playerName) => (e) => {
      playerList.forEach((player) => {
        anchorEls[player.username] = null;
      });
      openPopovers = [];
      setAnchorEls({ ...anchorEls, [playerName]: e.currentTarget });
      openPopovers.push(playerName);
    };

    const open = {};
    playerList.forEach((player) => {
      open[player.username] = Boolean(anchorEls[player.username]);
    });

    return (
      <ul className="PlayerList StreamList">
        {playerList.sort((a, b) => b.association.localeCompare(a.association)).map((player) => {
          const playerAssociation = player.association === 'streamer' && player.channel.toUpperCase() in AssociationLogos
            ? player.channel
            : player.association;
          const Logo = playerAssociation.toUpperCase() in AssociationLogos
            ? AssociationLogos[playerAssociation.toUpperCase()]
            : AssociationLogos.RIT;
          const pData = playerData[player.username];
          const playerConnected = player.username in playerData;
          return (
            <Fragment key={player.username}>
              <Link
                className={`list-element ${playerAssociation}`}
                onClick={() => playerOnClick(player)}
                aria-owns={open[player.username] ? `${player.username}-popover` : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen(player.username)}
                onMouseLeave={handlePopoverClose(player.username)}
                to="/Store"
              >
                <p>{`${player.name} [${player.username}]`}</p>
                <Logo className="team-logo" />
                <Icon path={mdiCart} className="shop-logo" />
              </Link>
              <Popover
                id={`${player.username}-popover`}
                className="player-popover"
                sx={{ pointerEvents: 'none' }}
                open={open[player.username]}
                anchorEl={anchorEls[player.username]}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={handlePopoverClose(player.username)}
                disableRestoreFocus
              >
                <img className="player-icon" src={`${getApiUrl()}/dynmap/icons/${player.username}`} alt={player.username} onError={(e) => { e.currentTarget.src = steveFace; }} />
                <span className="player-health">
                  {playerConnected ? `${pData.health} (` : ''}
                  {playerConnected && ItemSymbols('health', pData ? pData.health : null, true)}
                  {playerConnected ? ')' : ''}
                </span>
                <span className="player-armor">
                  {playerConnected ? `${pData.armor} (` : 'Not Connected'}
                  {playerConnected && ItemSymbols('armor', pData ? pData.armor : null, true)}
                  {playerConnected ? ')' : ''}
                </span>
              </Popover>
            </Fragment>
          );
        })}
      </ul>
    );
  };

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
            <StoreContent
              filterTag={filterTag}
              addItemToCart={addItemToCart}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
            <nav className="quick-store-nav bg-csh-secondary">
              <button type="button" id="store-all" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('ALL')} onClick={handleQuickBuyFilters('ALL')}>
                <Icon path={mdiScriptText} className="stream-button-icon" />
              </button>
              <button type="button" id="store-tool" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('TOOL')} onClick={handleQuickBuyFilters('TOOL')}>
                <Icon path={mdiPickaxe} className="stream-button-icon" />
              </button>
              <button type="button" id="store-weapon" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('WEAPON')} onClick={handleQuickBuyFilters('WEAPON')}>
                <Icon path={mdiSwordCross} className="stream-button-icon" />
              </button>
              <button type="button" id="store-armor" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('ARMOR')} onClick={handleQuickBuyFilters('ARMOR')}>
                <Icon path={mdiShield} className="stream-button-icon" />
              </button>
              <button type="button" id="store-food" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('FOOD')} onClick={handleQuickBuyFilters('FOOD')}>
                <Icon path={mdiFoodDrumstick} className="stream-button-icon" />
              </button>
              <button type="button" id="store-material" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('MATERIAL')} onClick={handleQuickBuyFilters('MATERIAL')}>
                <Icon path={mdiSack} className="stream-button-icon" />
              </button>
              <button type="button" id="store-effects" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('EFFECT')} onClick={handleQuickBuyFilters('EFFECT')}>
                <Icon path={mdiWizardHat} className="stream-button-icon" />
              </button>
              <button type="button" id="store-mobs" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('MOB')} onClick={handleQuickBuyFilters('MOB')}>
                <Icon path={mdiSkull} className="stream-button-icon" />
              </button>
              <button type="button" id="store-misc" className="stream-button bg-csh-secondary btn hide" onKeyDown={handleQuickBuyFilters('MISC')} onClick={handleQuickBuyFilters('MISC')}>
                <Icon path={mdiFlask} className="stream-button-icon" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      <h2 className="stream-row-title row-center">Check Out Our Live Map</h2>
      <div className="stream-row">
        <iframe className="stream-row-item stream-row-iframe dynmap" title="Dynmap" src="https://dionysus.csh.rit.edu" />
      </div>
      <h2 className="stream-row-title row-reverse">About the Stream</h2>
      <div className="stream-row row-reverse bg-csh-secondary-gradient">
        <video className="stream-row-item" playsInline autoPlay muted loop preload="none" src={BackgroundVideo} />
        <article className="stream-row-item stream-row-text-box">
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
      <div className="stream-row bg-csh-secondary-gradient">
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
  cartItems: PropTypes.array.isRequired,
  setCartItems: PropTypes.func.isRequired,
};

export default Stream;
