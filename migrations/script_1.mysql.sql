CREATE DATABASE game_settings;
USE game_settings;

CREATE TABLE `game_settings`.`setting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `current_version_id` INT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE);


CREATE TABLE `game_settings`.`setting_version` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `setting_id` INT NOT NULL,
  `version` INT NOT NULL,
  `value` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `setting_version` (`setting_id` ASC, `version` ASC) VISIBLE);

CREATE TABLE `game_settings`.`tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE);

CREATE TABLE `setting_version_tags_tag` (
  `tag_id` int NOT NULL,
  `version_id` int NOT NULL,
  PRIMARY KEY (`tag_id`,`version_id`)
)
