import armors from './armors';
import effects from './effects';
import foods from './foods';
import materials from './materials';
import misc from './misc';
import mobs from './mobs';
import tools from './tools';
import weapons from './weapons';

const allFlat = new Map(
  Object.entries({
    ...armors,
    ...effects,
    ...foods,
    ...materials,
    ...misc,
    ...mobs,
    ...tools,
    ...weapons
  })
);

const all = new Map(
  Object.entries({
    armors: new Map(Object.entries(armors)),
    effects: new Map(Object.entries(armors)),
    foods: new Map(Object.entries(armors)),
    materials: new Map(Object.entries(armors)),
    misc: new Map(Object.entries(armors)),
    mobs: new Map(Object.entries(armors)),
    tools: new Map(Object.entries(armors)),
    weapons: new Map(Object.entries(armors))
  })
);

export {
  all,
  allFlat,
  armors,
  effects,
  foods,
  materials,
  misc,
  mobs,
  tools,
  weapons
};
