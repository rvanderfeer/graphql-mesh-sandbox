
DROP DATABASE IF EXISTS MariaDB_database;
CREATE DATABASE IF NOT EXISTS MariaDB_database;
USE MariaDB_database;

GRANT ALL ON MariaDB_database.* TO MariaDB_user;

DROP TABLE IF EXISTS organisation;

CREATE TABLE `organisation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agbCode` varchar(8) DEFAULT NULL UNIQUE ,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `organisation` (`id`, `agbCode`, `label`, `url`)
VALUES
	(1, NULL, 'Organisation 1 - NO AGBCode', 'http://www.1111.com');

INSERT INTO `organisation` (`id`, `agbCode`, `label`, `url`)
VALUES
	(2, '01052222', 'Organisation 2 - 01052222', 'http://www.2222.com');

INSERT INTO `organisation` (`id`, `agbCode`, `label`, `url`)
VALUES
	(3, '01053333', 'Organisation 3 - 01053333', 'http://www.3333.com');

INSERT INTO `organisation` (`id`, `agbCode`, `label`, `url`)
VALUES
	(4, '01054444', 'Organisation 4 - AGB code not present in MongoDB', 'http://www.4444.com');

INSERT INTO `organisation` (`id`, `agbCode`, `label`, `url`)
VALUES
	(5, '01055555', 'Organisation 5 - 01055555', 'http://www.55555.com');




