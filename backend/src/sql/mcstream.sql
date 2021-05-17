CREATE TABLE IF NOT EXISTS players(
    username varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    type ENUM('csh', 'blackbaud', 'hogs', 'ehouse', 'sse', 'arthouse', 'rit'),
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS items(
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('weapon', 'armor', 'misc', 'tool', 'food', 'buff', 'material'),
    `price` FLOAT(20, 2) NOT NULL,
    `disabled` BOOLEAN NOT NULL,
    PRIMARY KEY (id, type)
);

CREATE TABLE IF NOT EXISTS weapon(
    `id` VARCHAR(255) NOT NULL,
    `damage` FLOAT(20, 2) NOT NULL,
    `durability` INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS armor(
    `id` VARCHAR(255) NOT NULL,
    `protection` INT NOT NULL,
    `durability` INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tool(
    `id` VARCHAR(255) NOT NULL,
    `speed` INT NOT NULL,
    `durability` INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS food(
    `id` VARCHAR(255) NOT NULL,
    `hungerFill` FLOAT(4, 2) NOT NULL,
    `effects` TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS buff(
    `id` VARCHAR(255) NOT NULL,
    `seconds` INT NOT NULL,
    `effects` TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS effects(
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` FLOAT(20, 2) NOT NULL,
    `time` INT NOT NULL,
    `power` INT NOT NULL,
    `disabled` BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS mobs(
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` FLOAT(20, 2) NOT NULL,
    `loopAmount` INT NOT NULL,
    `optionalDataTag` TEXT NOT NULL,
    `disabled` BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS checkout(
    `id` INT NOT NULL,
    `disabled` BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO checkout (id, disabled) VALUES ("1", "0");
