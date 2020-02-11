CREATE TABLE IF NOT EXISTS items(
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('weapon', 'armor', 'misc', 'tool', 'food', 'buff', 'material'),
    PRIMARY KEY (id, type)
);

CREATE TABLE IF NOT EXISTS weapons(
    id INT NOT NULL,
    damage FLOAT(20, 2) NOT NULL,
    durability INT NOT NULL
);

CREATE TABLE IF NOT EXISTS armor(
    id INT NOT NULL,
    protection INT NOT NULL,
    durability INT NOT NULL
);

CREATE TABLE IF NOT EXISTS tools(
    id INT NOT NULL,
    speed INT NOT NULL,
    durability INT NOT NULL
);

CREATE TABLE IF NOT EXISTS food(
    id INT NOT NULL,
    hungerFill FLOAT(4, 2) NOT NULL,
    effects TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS buffs(
    id INT NOT NULL,
    seconds INT NOT NULL,
    effects TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS materials(
    id INT NOT NULL,
    damage FLOAT(20, 2) NOT NULL,
    durability INT NOT NULL
);