import armors from './armors';
import effects from './effects';
import foods from './foods';
import materials from './materials';
import misc from './misc';
import mobs from './mobs';
import tools from './tools';
import weapons from './weapons';

export const data = {
  armors,
  effects,
  foods,
  materials,
  misc,
  mobs,
  tools,
  weapons,
  all: [
    ...armors,
    ...effects,
    ...foods,
    ...materials,
    ...misc,
    ...mobs,
    ...tools,
    ...weapons
  ],
  items: [
    armors,
    foods,
    materials,
    misc,
    tools,
    weapons
  ]
};
