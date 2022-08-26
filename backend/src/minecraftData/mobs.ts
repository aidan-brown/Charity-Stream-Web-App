const mobs = {
  mob_axolotl: {
    id: 'axolotl',
    displayName: 'Axolotl',
    type: 'mob',
    description: "You're my friend now! We're having soft tacos later!",
    price: 0.30
  },
  mob_bat: {
    id: 'bat',
    displayName: 'Bat',
    type: 'mob',
    description: "'Chirp Chirp' -some bat somewhere probably.",
    price: 0.10
  },
  mob_bee: {
    id: 'bee',
    displayName: 'Bee',
    type: 'mob',
    description: 'Give someone a BEEutiful surprise.',
    price: 0.30
  },
  mob_chicken: {
    id: 'chicken',
    displayName: 'Chicken',
    type: 'mob',
    description: 'Like cooked chicken but they have to put in some elbow grease.',
    price: 0.10
  },
  mob_pig: {
    id: 'pig',
    displayName: 'Pig',
    type: 'mob',
    description: 'This is some bougie pork.',
    price: 0.20
  },
  mob_cow: {
    id: 'cow',
    displayName: 'Cow',
    type: 'mob',
    description: "'Moo' -Jerald the Cow",
    price: 0.20
  },
  mob_goat: {
    id: 'goat',
    displayName: 'Goat',
    type: 'mob',
    description: 'baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    price: 0.20
  },
  mob_donkey: {
    id: 'donkey',
    displayName: 'Donkey',
    type: 'mob',
    description: "Shrek's pet, idk I didn't watch the movie",
    price: 0.50
  },
  mob_llama: {
    id: 'llama',
    displayName: 'Llama',
    type: 'mob',
    description: "It'll probably just spit on people.",
    price: 0.50
  },
  mob_polar_bear: {
    id: 'polar_bear',
    displayName: 'Polar Bear',
    type: 'mob',
    description: 'They changed the dogs in Minecraft!',
    price: 1.10
  },
  mob_zombie: {
    id: 'zombie',
    displayName: 'Zombie',
    type: 'mob',
    description: '...Brains...',
    price: 1.00
  },
  mob_husk: {
    id: 'husk',
    displayName: 'Husk',
    type: 'mob',
    description: 'Like corn meets a zombie',
    price: 1.30
  },
  mob_cave_spider: {
    id: 'cave_spider',
    displayName: 'Cave Spider',
    type: 'mob',
    description: 'Cave spiders, really? You hate a player that much?',
    price: 3.00
  },
  mob_spider: {
    id: 'spider',
    displayName: 'Spider',
    type: 'mob',
    description: '♫ Spiderman, Spiderman, does whatever a spider can... ♫',
    price: 3.00
  },
  mob_skeleton: {
    id: 'skeleton',
    displayName: 'Skeleton',
    type: 'mob',
    description: 'Bone shooty man.',
    price: 2.00
  },
  mob_creeper: {
    id: 'creeper',
    displayName: 'Creeper',
    type: 'mob',
    description: 'Tssssssss *BOOM*',
    price: 4.00
  },
  mob_witch: {
    id: 'witch',
    displayName: 'Witch',
    type: 'mob',
    description: 'He he he.',
    price: 6.00
  },
  mob_pillager: {
    id: 'pillager',
    displayName: 'Pillager',
    type: 'mob',
    description: 'For all your pillaging needs.',
    price: 1.90
  },
  mob_evoker: {
    id: 'evoker',
    displayName: 'Evoker',
    type: 'mob',
    description: 'He Evoke. He protec.',
    price: 4.70
  },
  mob_vindicator: {
    id: 'vindicator',
    displayName: 'Vindicator',
    type: 'mob',
    description: '#1 provider of vindication. (results may vary)',
    price: 4.70
  },
  mob_piglin: {
    id: 'piglin',
    displayName: 'Piglin',
    type: 'mob',
    description: "Greedy pig people that like a display of wealth. (won't attack those clad in gold armor)",
    price: 2.00
  },
  mob_piglin_brute: {
    id: 'piglin_brute',
    displayName: 'Piglin Brute',
    type: 'mob',
    description: 'Calling them brutish might be an understatement.',
    price: 9.80
  },
  mob_hoglin: {
    id: 'hoglin',
    displayName: 'Hoglin',
    type: 'mob',
    description: 'Beeg beefy boi.',
    price: 3.00
  },
  mob_ghast: {
    id: 'ghast',
    displayName: 'Ghast',
    type: 'mob',
    description: '[:O]=',
    price: 3.00
  },
  mob_blaze: {
    id: 'blaze',
    displayName: 'Blaze',
    type: 'mob',
    description: 'Fireball, do do do doo doo do *whoop whoop*.',
    price: 3.30
  },
  mob_wither_skeleton: {
    id: 'wither_skeleton',
    displayName: 'Wither Skeleton',
    type: 'mob',
    description: 'Wither minions for the Wither TM.',
    price: 2.70
  },
  mob_enderman: {
    id: 'enderman',
    displayName: 'Enderman',
    type: 'mob',
    description: 'He picks things up and puts them down.',
    price: 2.10
  },
  mob_endermite: {
    id: 'endermite',
    displayName: 'Endermite',
    type: 'mob',
    description: 'A telleporting mini bug.',
    price: 1.00
  },
  mob_lightning_bolt: {
    id: 'lightning_bolt',
    displayName: 'Lightning Bolt',
    type: 'mob',
    description: 'Basically just kill someone.',
    price: 8.00
  },
  mob_cod: {
    id: 'cod',
    displayName: 'A Lot of Cod',
    type: 'mob',
    description: 'GET CODDED (will spawn a lot of cod)',
    count: 100,
    price: 10.00
  },
  mob_wither: {
    id: 'wither',
    displayName: 'Wither',
    type: 'mob',
    description: 'Literally just a chaos thing with three heads.',
    price: 80.00
  },
  mob_ender_dragon: {
    id: 'ender_dragon',
    displayName: 'Ender Dragon',
    type: 'mob',
    description: 'Like Skyrim but with blocks.',
    price: 120.00,
    nbt: '{DragonPhase:0}'
  }
};

export default mobs;
