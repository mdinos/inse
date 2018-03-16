create database if not exists users;

create table if not exists users.accounts (
  id int primary key auto_increment,
  username varchar(32),
  password varchar(32),
  email varchar(50)
)

insert ignore into users.accounts values (1, 'hashim100', 'password', 'hashim@hotmail.com')
