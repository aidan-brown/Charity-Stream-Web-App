import { mdiGoogleController } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import {
  bohchoi, cahriid, clipsothealien, dawnshadowx3, laqqy, mysticat, pepband,
} from './images';
import {
  RIT, CSH, ARTHOUSE, BLACKBAUD, EHOUSE, HOGS, SSE, IHOUSE, TWITCH,
} from './svg';

export default {
  RIT,
  CSH,
  ARTHOUSE,
  BLACKBAUD,
  EHOUSE,
  HOGS,
  SSE,
  IHOUSE,
  STREAMER: TWITCH,
  PEPBAND: () => <img src={pepband} alt="Pep Band logo" className="team-logo" />,
  CAHRIID: () => <img src={cahriid} alt="Cahriid logo" className="team-logo" />,
  CLIPSO: () => <img src={clipsothealien} alt="Clipsothealien logo" className="team-logo" />,
  LAQQQY: () => <img src={laqqy} alt="Laqqy logo" className="team-logo" />,
  MYSTICATLIVE: () => <img src={mysticat} alt="Mysticat logo" className="team-logo" />,
  DAWNSHADOWX3: () => <img src={dawnshadowx3} alt="Dawnshadowx3 logo" className="team-logo" />,
  BOHCHOI: () => <img src={bohchoi} alt="BohChoi logo" className="team-logo" />,
  OTHER: () => <Icon path={mdiGoogleController} className="team-logo" />,
};
