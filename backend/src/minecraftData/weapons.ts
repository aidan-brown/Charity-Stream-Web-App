const weapons = [
  {
    id: 'golden_sword',
    displayName: 'Gold Sword',
    type: 'weapon',
    description: "Gold isn't really known for making great swords but we made one anyways. Help your favorite player look stylish in battle!",
    price: 1.00,
    damage: 4,
    durability: 32
  },
  {
    id: 'iron_sword',
    displayName: 'Iron Sword',
    type: 'weapon',
    description: 'An upgraded sword for combat. Help your favorite player triumph in battle!',
    price: 1.50,
    damage: 6,
    durability: 250
  },
  {
    id: 'diamond_sword',
    displayName: 'Diamond Sword',
    type: 'weapon',
    description: 'One of the best swords for combat. Help your favorite player triumph in battle with style!',
    price: 7.30,
    damage: 7,
    durability: 1561
  },
  {
    id: 'netherite_sword',
    displayName: 'Netherite Sword',
    type: 'weapon',
    description: "This is the best of the best, they'll do lots of damage with this one. Help your favorite player triumph in battle with style!",
    price: 10.80,
    damage: 8,
    durability: 2031
  },
  {
    id: 'golden_axe',
    displayName: 'Gold Axe',
    type: 'weapon',
    description: 'Gold may not be the best metal for weaponry but it sure do make you look good. For that special barbarian in your life.',
    price: 1.00,
    damage: 7,
    durability: 32
  },
  {
    id: 'iron_axe',
    displayName: 'Iron Axe',
    type: 'weapon',
    description: "A barbarian's #1 weapon of choice and great for separating heads from their bodies. Help your favorite player decimate the battlefield!",
    price: 1.50,
    damage: 9,
    durability: 250
  },
  {
    id: 'diamond_axe',
    displayName: 'Diamond Axe',
    type: 'weapon',
    description: 'A very durable axe for long term head cleaving. Help your favorite player decimate the battlefield forever!',
    price: 9.40,
    damage: 9,
    durability: 1561
  },
  {
    id: 'netherite_axe',
    displayName: 'Netherite Axe',
    type: 'weapon',
    description: 'There are no nuclear warheads in Minecraft but I think this would be the closest to a weapon of mass destruction. Help your favorite player become the god of the battlefield!',
    price: 13.50,
    damage: 10,
    durability: 2031
  },
  {
    id: 'trident',
    displayName: 'Trident',
    type: 'weapon',
    description: "We stole this from Poseidon so that you can put the power of the sea into your favorite player's hands.",
    price: 4.00,
    damage: 9,
    durability: 250,
    nbt: '{Enchantments:[{id:loyalty,lvl:3}]}'
  },
  {
    id: 'bow',
    displayName: 'Bow',
    type: 'weapon',
    description: "Minecraft's signature ranged weapon. Can take out foes at a distance! (comes with 20 arrows)",
    price: 3.80,
    damage: 4,
    durability: 384
  },
  {
    id: 'crossbow',
    displayName: 'Crossbow',
    type: 'weapon',
    description: "Minecraft's *NEW* signature ranged weapon. Can take out foes at a distance! (comes with 20 arrows)",
    price: 8.40,
    damage: 9,
    durability: 465
  },
  {
    id: 'arrow',
    displayName: '10x Arrows',
    type: 'weapon',
    description: 'The basic ammo for the bow or crossbow. Comes with 10 arrows!',
    price: 1.20,
    count: 10
  },
  {
    id: 'spectral_arrow',
    displayName: '10x Spectral Arrows',
    type: 'weapon',
    description: 'Like the normal arrows but *spectral*. Comes with 10 arrows!',
    effects: 'Enemies hit with these arrows will glow through walls.',
    price: 2.00,
    count: 10
  },
  {
    id: 'tipped_arrow-0',
    displayName: '10x Arrows of Slowness',
    type: 'weapon',
    description: 'Arrows tipped with a potion of slowness. Comes with 10 arrows!',
    effects: 'Enemies hit with these arrows will be slowed for a brief time.',
    price: 2.50,
    count: 10,
    nbt: '{Potion:"slowness"}'
  },
  {
    id: 'tipped_arrow-1',
    displayName: '10x Arrows of Harming',
    type: 'weapon',
    description: 'Arrows tipped with a harmful potion. Comes with 10 arrows!',
    effects: 'Enemies hit with these arrows will take more damage.',
    price: 2.50,
    count: 10,
    nbt: '{Potion:"harming"}'
  },
  {
    id: 'tipped_arrow-2',
    displayName: '10x Arrows of Poison',
    type: 'weapon',
    description: 'Arrows tipped with poison. Comes with 10 arrows!',
    effects: 'Enemies hit with these arrows will be poisoned for a brief time.',
    price: 2.50,
    count: 10,
    nbt: '{Potion:"poison"}'
  },
  {
    id: 'tipped_arrow-3',
    displayName: '10x Arrows of Weakness',
    type: 'weapon',
    description: 'Arrows tipped with a weakness potion. Comes with 10 arrows!',
    effects: 'Enemies hit with these arrows will weakened for a brief time.',
    price: 2.50,
    count: 10,
    nbt: '{Potion:"weakness"}'
  }
];

export default weapons;
