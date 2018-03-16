CREATE DATABASE IF NOT EXISTS splitmatedb;

CREATE TABLE IF NOT EXISTS `user` (
  `email` VARCHAR(64) PRIMARY KEY,
  `fname` VARCHAR(40),
  `lname` VARCHAR(40),
);


CREATE TABLE IF NOT EXISTS `event`(
  `eventid` int(9) PRIMARY KEY auto_increment,
  `eventName` VARCHAR(40),
  `eventDesc` VARCHAR(256),
  `eventCost` INT(10),
  `email` VARCHAR(64)
);

ALTER TABLE `event` ADD CONSTRAINT `FK_UserGroup` FOREIGN KEY (`email`) REFERENCES `user`(`email`);
