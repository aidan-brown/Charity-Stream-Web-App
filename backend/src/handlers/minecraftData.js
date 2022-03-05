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
    case 'armors': res.status(200).send(armors.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'effects': res.status(200).send(effects.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'foods': res.status(200).send(foods.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'materials': res.status(200).send(materials.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'misc': res.status(200).send(misc.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'mobs': res.status(200).send(mobs.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'tools': res.status(200).send(tools.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'weapons': res.status(200).send(weapons.map((c) => ({ ...c, disabled: 0 }))); break;
    case 'items': {
      const items = [
        ...armors.map((armor) => ({ ...armor, type: 'armor', disabled: 0 })),
        ...foods.map((food) => ({ ...food, type: 'food', disabled: 0 })),
        ...materials.map((material) => ({ ...material, type: 'material', disabled: 0 })),
        ...misc.map((m) => ({ ...m, type: 'misc', disabled: 0 })),
        ...tools.map((tool) => ({ ...tool, type: 'tool', disabled: 0 })),
        ...weapons.map((weapon) => ({ ...weapon, type: 'weapon', disabled: 0 })),
      ];

      res.status(200).send(items);
      break;
    }

    default:
      res.status(400).send('Valid mc data types are: armors, effects, foods, materials, misc, mobs, tools, weapons, and items');
      break;
  }
};

module.exports = getMinecraftData;
