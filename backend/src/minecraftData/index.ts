import armor from './armor';
import effect from './effect';
import food from './food';
import material from './material';
import misc from './misc';
import mob from './mob';
import tool from './tool';
import weapon from './weapon';

const allFlat = new Map(
  Object.entries({
    ...armor,
    ...effect,
    ...food,
    ...material,
    ...misc,
    ...mob,
    ...tool,
    ...weapon
  })
);

const all = new Map(
  Object.entries({
    ARMOR: new Map(Object.entries(armor)),
    EFFECT: new Map(Object.entries(effect)),
    FOOD: new Map(Object.entries(food)),
    MATERIAL: new Map(Object.entries(material)),
    MISC: new Map(Object.entries(misc)),
    MOB: new Map(Object.entries(mob)),
    TOOL: new Map(Object.entries(tool)),
    WEAPON: new Map(Object.entries(weapon))
  })
);

export {
  all,
  allFlat,
  armor,
  effect,
  food,
  material,
  misc,
  mob,
  tool,
  weapon
};
