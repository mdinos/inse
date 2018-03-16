const express = require('express');
const app = express();
const GoogleAuth = require('simple-google-openid');
const path = require('path');

const db = require('../database/model-mysql');


// Server uses index.html in the /webpages folder
app.use('/', express.static('../webpages', { extensions: ['html'] }));

// Declaration of port to be used by the server.
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});


// GOOGLE AUTH //
app.use(GoogleAuth('970239039977-e085je51cdsf0191okl0kr1u8ks4u6l7.apps.googleusercontent.com'));
app.use('/api', GoogleAuth.guardMiddleware());

// SERVER FUNCTIONS //
app.get('/api/login', login);
app.get('/api/logout', logout);
app.get('/api/hello', hello);
app.get('/api/deliver', deliver);
app.get('/api/getemail', getEmail);
//app.get('/api/myevents', myEvents);
app.post('/api/makeevent', createEvent);
app.post('/api/checkuser', checkuser);


// Initialise the events array
let events = [
    {
        "id": 1,
        "eventName": "Death Star Destruction",
        "eventDescription": "Fly into the middle, destroy the core",
        "testBalance": 33.25,
        "emails": ["marcus@email.com", "jack@email.com"]
    }
];

let usedIds = [1];

// "Test" function for Google Accounts
function hello(req, res) {
  res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');
  console.log('successful authenticated request by ' + req.user.emails[0].value);
}

// Login function, server sends main page HTML as response.
function login (req, res) {
  res.sendFile('main.html', {root: '../webpages'});
  console.log('main.html sent');
}

// Logout function, server sends index page HTML as response.
function logout (req, res) {
  res.sendFile('index.html', {root: '../webpages'});
  console.log('index.html sent');
}

// Deliver function, server sends HTML of page input.
function deliver (req, res) {
    let page = req.query.page;
    res.sendFile(page, {root: '../webpages'});
    console.log(page + " sent");
}

/*function myEvents(req, res) {

}*/

// Server function used to create a new event, based on data sent into the Function
// from main.js.
async function createEvent(req, res) {
    await db.createEvent(req.query.eventName, req.query.eventDesc, req.query.testBalance, req.query.emails);
};


async function checkuser (req, res) {
  let fullName = req.user.displayName;
  let firstName = fullName.split(' ').slice(0, -1).join(' ');
  let lastName = fullName.split(' ').slice(-1).join(' ');

  await db.login(req.user.emails[0].value, firstName, lastName);
  return;
}

function getEmail(req, res) {
    let email = req.user.emails[0].value;
    res.send(email);
}
