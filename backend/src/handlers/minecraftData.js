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
const { DisabledElement, PriceOverride } = require('../sql/models');

const getMinecraftData = async (req, res) => {
  const { type } = req.params;

  try {
    const disabledElements = await DisabledElement.findAll();
    const priceOverrides = await PriceOverride.findAll();

    switch (type) {
      case 'armors':
        res.status(200).send(armors.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'effects':
        res.status(200).send(effects.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'foods':
        res.status(200).send(foods.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'materials':
        res.status(200).send(materials.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'misc':
        res.status(200).send(misc.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'mobs':
        res.status(200).send(mobs.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'tools':
        res.status(200).send(tools.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'weapons':
        res.status(200).send(weapons.map((c) => ({
          ...c,
          disabled: !!disabledElements.find((e) => e.id === c.id),
          price: (() => {
            const override = priceOverrides.find((e) => e.id === c.id);

            if (override) return override.price;
            return c.price;
          })(),
        })));
        break;
      case 'items': {
        const items = [
          ...armors.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...foods.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...materials.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...misc.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...tools.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...weapons.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
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
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...foods.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...materials.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...misc.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...tools.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...weapons.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...mobs.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
          ...effects.map((c) => ({
            ...c,
            disabled: !!disabledElements.find((e) => e.id === c.id),
            price: (() => {
              const override = priceOverrides.find((e) => e.id === c.id);

              if (override) return override.price;
              return c.price;
            })(),
          })),
        ];

        res.status(200).send(all);
        break;
      }
      default:
        res.status(400).send('Valid mc data types are: armors, effects, foods, materials, misc, mobs, tools, weapons, and items');
        break;
    }
  } catch (_) {
    res.status(500).send('Could not find disabled items');
  }
};

module.exports = getMinecraftData;
