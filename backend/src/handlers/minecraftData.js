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
const { DisabledElement } = require('../sql/models');
const { logger } = require('../utils');

const getMinecraftData = async (req, res) => {
  const { type } = req.params;

  try {
    const disabledElements = await DisabledElement.findAll();

    switch (type) {
      case 'armors':
        res.status(200).send(armors.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'effects':
        res.status(200).send(effects.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'foods':
        res.status(200).send(foods.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'materials':
        res.status(200).send(materials.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'misc':
        res.status(200).send(misc.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'mobs':
        res.status(200).send(mobs.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'tools':
        res.status(200).send(tools.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'weapons':
        res.status(200).send(weapons.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
        })));
        break;
      case 'items': {
        const items = [
          ...armors.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...foods.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...materials.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...misc.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...tools.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...weapons.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
        ];

        res.status(200).send(items);
        break;
      }
      case 'all': {
        const all = [
          ...armors.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...foods.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...materials.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...misc.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...tools.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...weapons.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...mobs.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
          ...effects.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
          })),
        ];

        res.status(200).send(all);
        break;
      }
      default:
        res.status(400).send('Valid mc data types are: armors, effects, foods, materials, misc, mobs, tools, weapons, and items');
        break;
    }
  } catch (error) {
    logger.log('GET_DISABLED_ITEMS_FAILED', 'Failed to get disabled items', { error });

    res.status(500).send('Could not find disabled items');
  }
};

module.exports = getMinecraftData;
