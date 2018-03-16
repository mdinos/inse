CREATE DATABASE IF NOT EXISTS splitmatedb;

CREATE TABLE `user` (
  `email` VARCHAR(64) PRIMARY KEY,
  `fname` VARCHAR(40),
  `lname` VARCHAR(40)
);


CREATE TABLE `event`(
  `eventid` INT(10) PRIMARY KEY AUTO_INCREMENT,
  `eventName` VARCHAR(40),
  `eventDesc` VARCHAR(256),
  `eventCost` INT(10),
  `emails` VARCHAR(256),
  `admin` VARCHAR(64)
);

ALTER TABLE `event` ADD CONSTRAINT `event_fk0` FOREIGN KEY (`email`) REFERENCES `user`(`email`);
