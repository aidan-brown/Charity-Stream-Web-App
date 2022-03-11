const {
  armors,
  effects,
  foods,
  materials,
  misc,
  mobs,
  tools,
  weapons,
} = require('../minecraftData');

const getMinecraftData = async (req, res) => {
  const { type } = req.params;

  switch (type) {
    case 'armors': res.status(200).send(armors.map((c) => ({ ...c, disabled: false }))); break;
    case 'effects': res.status(200).send(effects.map((c) => ({ ...c, disabled: false }))); break;
    case 'foods': res.status(200).send(foods.map((c) => ({ ...c, disabled: false }))); break;
    case 'materials': res.status(200).send(materials.map((c) => ({ ...c, disabled: false }))); break;
    case 'misc': res.status(200).send(misc.map((c) => ({ ...c, disabled: false }))); break;
    case 'mobs': res.status(200).send(mobs.map((c) => ({ ...c, disabled: false }))); break;
    case 'tools': res.status(200).send(tools.map((c) => ({ ...c, disabled: false }))); break;
    case 'weapons': res.status(200).send(weapons.map((c) => ({ ...c, disabled: false }))); break;
    case 'items': {
      const items = [
        ...armors.map((armor) => ({ ...armor, type: 'armor', disabled: false })),
        ...foods.map((food) => ({ ...food, type: 'food', disabled: false })),
        ...materials.map((material) => ({ ...material, type: 'material', disabled: false })),
        ...misc.map((m) => ({ ...m, type: 'misc', disabled: false })),
        ...tools.map((tool) => ({ ...tool, type: 'tool', disabled: false })),
        ...weapons.map((weapon) => ({ ...weapon, type: 'weapon', disabled: false })),
      ];

      res.status(200).send(items);
      break;
    }
    case 'all': {
      const all = [
        ...armors.map((armor) => ({ ...armor, type: 'armor', disabled: false })),
        ...foods.map((food) => ({ ...food, type: 'food', disabled: false })),
        ...materials.map((material) => ({ ...material, type: 'material', disabled: false })),
        ...misc.map((m) => ({ ...m, type: 'misc', disabled: false })),
        ...tools.map((tool) => ({ ...tool, type: 'tool', disabled: false })),
        ...weapons.map((weapon) => ({ ...weapon, type: 'weapon', disabled: false })),
        ...mobs.map((mob) => ({ ...mob, type: 'mob', disabled: false })),
        ...effects.map((effect) => ({ ...effect, type: 'effect', disabled: false })),
      ];

      res.status(200).send(all);
      break;
    }
    default:
      res.status(400).send('Valid mc data types are: armors, effects, foods, materials, misc, mobs, tools, weapons, and items');
      break;
  }
};

module.exports = getMinecraftData;
