const foods = [
  {
    id: 'bread',
    displayName: '5x Bread',
    type: 'food',
    description: 'A good basic food.',
    price: 0.50,
    hungerFill: 5,
    count: 5
  },
  {
    id: 'cooked_beef',
    displayName: '5x Steak',
    type: 'food',
    description: 'A very filling food.',
    price: 1.00,
    hungerFill: 8,
    count: 5
  },
  {
    id: 'golden_apple',
    displayName: 'Golden Apple',
    type: 'food',
    description: 'Filled with magic, this powerful apple grants you extra health!',
    effects: 'Gives a health boost and health regen!',
    price: 3.00,
    hungerFill: 4
  },
  {
    id: 'enchanted_golden_apple',
    displayName: 'Enchanted Golden Apple',
    type: 'food',
    description: 'The ultimate food, this apple makes the player tough and filled with vitality!',
    effects: 'Gives lots of extra health, regen and fire resistance!',
    price: 10.00,
    hungerFill: 4
  }
];

export default foods;
