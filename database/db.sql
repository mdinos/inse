CREATE DATABASE IF NOT EXISTS splitmatedb;

CREATE TABLE 'user' (
  'email' VARCHAR(64) PRIMARY KEY,
  'fname' VARCHAR(40) NOT NULL,
  'password' VARCHAR(40) NOT NULL,
  'lname' VARCHAR(40) NOT NULL,
  'admin' TINYINT(1),
);


CREATE TABLE 'group'(
  'groupID' int(9) PRIMARY KEY auto_increment,
  'groupName' VARCHAR(40),
  'email' VARCHAR(64),
);

ALTER TABLE 'group' ADD CONSTRAINT 'FK_UserGroup' FOREIGN KEY ('email') REFERENCES 'user'('email');
