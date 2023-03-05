CREATE DATABASE game_settings;
USE game_settings;

CREATE TABLE `game_settings`.`setting` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
    INDEX `type` (`type` ASC) VISIBLE
);

CREATE TABLE `game_settings`.`setting_version` (
    `setting_id` INT NOT NULL,
    `version` INT NOT NULL,
    `value` JSON NULL,
    PRIMARY KEY (`setting_id`, `version`)
);
