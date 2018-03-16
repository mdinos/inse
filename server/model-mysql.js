'use strict';

const fs = require('fs');
const mysql = require('mysql');

const config = require('./config');

const sql = mysql.createConnection(config.mysql);

module.exports.login = (usernamein, password) => {
  let pword = 'SELECT password FROM accounts WHERE username = ? ', [usernamein];
  if (username == uname) {
    if (password == pword) {
      console.log("SUCCESSFUL LOG IN");
      return true;
    } else {
      console.log("incorrect password");
      return false;
    }
  } else {
    console.log("incorrect username");
    return false;
  }
}
