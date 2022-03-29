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
  CLIPSOTHEALIEN: () => <img src={clipsothealien} alt="Clipsothealien logo" className="team-logo" />,
  LAQQY: () => <img src={laqqy} alt="Laqqy logo" className="team-logo" />,
  MYSTICAT: () => <img src={mysticat} alt="Mysticat logo" className="team-logo" />,
};
