'use strict';

const fs = require('fs');
const mysql = require('mysql');

const path = require('path');

let sql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "splitmatedb",
  multipleStatements: true
});

// DATABASE FUNCTIONS
async function login (email, fname, lname) {
  let insertEmail = "'" + email + "'";
  let fnameIn = "'" + fname + "'";
  let lnameIn = "'" + lname + "'";
  console.log("entered database login function");
  console.log("altered email to be entered: " + insertEmail);
  sql.query(sql.format('SELECT email FROM user WHERE email = ?', [insertEmail]), (err, data) => {
    if (err) {
      console.log("failed to query email from db", err)
      //reject (['failed to query email from db', err]);
      return;
    }


  if (data.length < 1) {
    console.log("No record found, attempting to insert into DB.");
    let insertSet = { email: insertEmail, fname: fnameIn, lname: lnameIn };
    sql.query(sql.format('INSERT INTO user SET ?', insertSet), (err, data) => {
      if (err) {
        console.log("error inserting into db: " + err);
        return;
      }
      console.log("succesfully inserted user information into db")
    });
  } else {
    console.log("record for this user already exists");
  }
  });
}

// FUNCTION EXPORTING
module.exports.login = login;
