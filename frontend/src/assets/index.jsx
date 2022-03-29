import React from 'react';
import {
  cahriid, clipsothealien, laqqy, mysticat, pepband,
} from './images';
import {
  RIT, CSH, ARTHOUSE, BLACKBAUD, EHOUSE, HOGS, SSE, TWITCH,
} from './svg';

export default {
  RIT,
  CSH,
  ARTHOUSE,
  BLACKBAUD,
  EHOUSE,
  HOGS,
  SSE,
  STREAMER: TWITCH,
  PEPBAND: () => <img src={pepband} alt="Pep Band logo" className="team-logo" />,
  CAHRIID: () => <img src={cahriid} alt="Cahriid logo" className="team-logo" />,
  CLIPSO: () => <img src={clipsothealien} alt="Clipsothealien logo" className="team-logo" />,
  LAQQQY: () => <img src={laqqy} alt="Laqqy logo" className="team-logo" />,
  MYSTICATLIVE: () => <img src={mysticat} alt="Mysticat logo" className="team-logo" />,
};
