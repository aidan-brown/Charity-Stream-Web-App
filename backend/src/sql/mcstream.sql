CREATE TABLE IF NOT EXISTS players(
    `username` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `type` ENUM('csh', 'blackbaud', 'hogs', 'ehouse', 'sse', 'arthouse', 'rit'),
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS STORE_DISABLED(
    `id` INT NOT NULL,
    `disabled` BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS serverData(
    `username` VARCHAR(255) NOT NULL,
    `health` FLOAT(20, 4) NOT NULL,
    `armor` FLOAT(20, 2) NOT NULL,
    `level` INT NOT NULL,
    `hunger` INT NOT NULL,
    PRIMARY KEY(username)
);
