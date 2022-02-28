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
    case 'armor': res.status(200).send(armors); break;
    case 'effect': res.status(200).send(effects); break;
    case 'food': res.status(200).send(foods); break;
    case 'material': res.status(200).send(materials); break;
    case 'misc': res.status(200).send(misc); break;
    case 'mobs': res.status(200).send(mobs); break;
    case 'tool': res.status(200).send(tools); break;
    case 'weapon': res.status(200).send(weapons); break;
    case 'items': {
      const items = [
        ...armors.map((armor) => ({ ...armor, type: 'armor' })),
        ...foods.map((food) => ({ ...food, type: 'food' })),
        ...materials.map((material) => ({ ...material, type: 'material' })),
        ...misc.map((m) => ({ ...m, type: 'misc' })),
        ...tools.map((tool) => ({ ...tool, type: 'tool' })),
        ...weapons.map((weapon) => ({ ...weapon, type: 'weapon' })),
      ];

      res.status(200).send(items);
      break;
    }

    default:
      res.status(400).send('Valid mc data types are: armor, effect, food, material, misc, mobs, tool, weapon, and items');
      break;
  }
};

module.exports = getMinecraftData;
