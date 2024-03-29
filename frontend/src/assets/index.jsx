/* eslint-disable camelcase */
import { mdiGoogleController } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import {
  bohchoi,
  cahriid,
  clipsothealien,
  dantayy5050,
  dawnshadowx3,
  laqqy,
  lumiinara,
  mysticat,
  roxkstar74,
  samanthiiana,
  skeleton_weeb,
  pepband,
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
  DANTAYY5050: () => <img src={dantayy5050} alt="Dantay5050 logo" className="team-logo" />,
  LUMIINARA: () => <img src={lumiinara} alt="Lumiinara logo" className="team-logo" />,
  ROXKSTAR74: () => <img src={roxkstar74} alt="Roxkstar74 logo" className="team-logo" />,
  SAMANTHIIANA: () => <img src={samanthiiana} alt="Samanthiiana logo" className="team-logo" />,
  SKELETON_WEEB: () => <img src={skeleton_weeb} alt="Skeleton_Weeb logo" className="team-logo" />,
  OTHER: () => <Icon path={mdiGoogleController} className="team-logo" />,
};
