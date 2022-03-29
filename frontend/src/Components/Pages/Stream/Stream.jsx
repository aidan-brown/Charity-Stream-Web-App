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
import { getUrl, getReq } from '../../../Utils';
import AssociationLogos from '../../../assets';

import { CHANNEL_IDS } from '../../../constants';

/** Class for constructing the stream page * */
const Stream = ({ setSelectedPlayer, addItemToCart }) => {
  const streamDiv = useRef();
  const [channel, setChannel] = useState('cshba');
  const [channelType, setChannelType] = useState('TWITCH');
  const [videoIds, setVideoIds] = useState({});
  const [thumbnailURLs, setThumbnailURLs] = useState('');
  const [streamWidth, setStreamWidth] = useState('100%');
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    getReq(`${getUrl()}/players`)
      .then((res) => res.json())
      .then((res) => {
        setPlayerList([...res, {
          name: 'test', username: 'test', association: 'streamer', channelType: 'YOUTUBE', channel: 'lofigirl',
        }]);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    playerList.forEach((player) => {
      if (player.association === 'streamer' && player.channelType === 'YOUTUBE') {
        getReq(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_IDS[player.channel]}&type=video&eventType=live&key=${process.env.YOUTUBE_API_KEY}`)
          .then((res) => res.json())
          .then((res) => {
            setVideoIds({ ...videoIds, [player.channel]: res.items[0].id.videoId });
            setThumbnailURLs({
              ...thumbnailURLs,
              [player.channel]: res.items[0].snippet.thumbnails.medium.url,
            });
          })
          .catch(() => {});
      }
    });
  }, [playerList]);

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
    const streamButtons = document.querySelectorAll('.stream-button');
    if (streamList.className.includes('hide')) {
      setStreamWidth('calc(100% - 35rem)');
      // eslint-disable-next-line no-param-reassign
      streamLists.forEach((list) => { list.className = list.className.replace('show', 'hide'); });
      // eslint-disable-next-line no-param-reassign
      streamButtons.forEach((button) => { button.className = button.className.replace('show', 'hide').replace('closed', 'open'); });
      streamDiv.current.className = streamDiv.current.className.replace('closed', 'open');
      streamList.className = streamList.className.replace('hide', 'show');
      streamButton.className = streamButton.className.replace('hide', 'show');
    } else {
      setStreamWidth('100%');
      // eslint-disable-next-line no-param-reassign
      streamButtons.forEach((button) => { button.className = button.className.replace('open', 'closed'); });
      streamDiv.current.className = streamDiv.current.className.replace('open', 'closed');
      streamList.className = streamList.className.replace('show', 'hide');
      streamButton.className = streamButton.className.replace('show', 'hide');
    }
  };

  const PerspectiveList = () => (
    <ul className="PerspectiveList StreamList">
      {[{ association: 'streamer', channel: 'cshba' }, ...playerList.sort((a, b) => a.association.localeCompare(b.association))].map((player) => {
        if (player.association !== 'streamer') return null;
        const channelName = player.channel;
        return (
          <button
            type="button"
            className="perspective-button"
            onClick={() => {
              setChannel(channelName);
              setChannelType(player.channelType);
            }}
            key={channelName}
          >
            <span className="perspective-overlay" />
            <span className="perspective-title">{channelName.toUpperCase()}</span>
            <img
              src={player.channelType !== 'YOUTUBE' || !thumbnailURLs[channelName]
                ? `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-440x248.jpg`
                : thumbnailURLs[channelName]}
              alt={channelName}
            />
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
          <StreamWindow
            title="Charity Stream"
            width={streamWidth}
            height="100%"
            url={channelType === 'TWITCH'
              ? `https://player.twitch.tv/?channel=${channel}&muted=true&parent=${window.location.hostname}`
              : `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_IDS[channel]}&autoplay=1`}
          />
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
          {PerspectiveList()}
        </div>
        <div id="chat-list" className="stream-list bg-csh-secondary-gradient hide">
          <h4>Stream Chat</h4>
          <iframe
            src={channelType === 'TWITCH'
              ? `https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}`
              : `https://www.youtube.com/live_chat?v=${videoIds[channel]}&embed_domain=${window.location.hostname}`}
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
            <StoreContent filterTag="all" addItemToCart={addItemToCart} />
          </div>
        </div>
      </div>
      <h2 className="stream-row-title">About the Stream</h2>
      <div className="stream-row">
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
      <h2 className="stream-row-title row-reverse">About the Hub World</h2>
      <div className="stream-row row-reverse">
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
