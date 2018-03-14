'use strict';

const express = require('express');
const app = express();
const GoogleAuth = require('simple-google-openid');
const path = require('path');

app.use('/', express.static('../webpages', { extensions: ['html'] }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});


// GOOGLE SHIT //

app.use(GoogleAuth('970239039977-e085je51cdsf0191okl0kr1u8ks4u6l7.apps.googleusercontent.com'));
app.use('/api', GoogleAuth.guardMiddleware());

// SERVER FUNCTIONS //

app.get('/api/login', login);
app.get('/api/logout', logout);
app.get('/api/hello', hello);

// Make a new event - currently not working //

/*
let events = [];
let usedIds = [1];

app.post('/api/makeevent', function (req, res) {
    console.log("success");
    
    console.log(usedIds);
    let newId = usedIds[usedIds.length - 1] + 1;
    usedIds.push(newId);
    usedIds.shift();
    console.log(usedIds);
    
    let newEvent = {
        "id": newId,
        "eventName": request.query.eventName,
        "eventDescription": request.query.eventDesc,
        "testBalance": request.query.testBalance
    }
    
    events.unshift(newEvent);
    response.send(newEvent);
    console.log("Event sent");
    
});*/

function hello(req, res) {
  res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');
  console.log('successful authenticated request by ' + req.user.emails[0].value);
}

function login (req, res) {
  res.sendFile('main.html', {root: '../webpages'});
  console.log('main.html sent');
}

function logout (req, res) {
  res.sendFile('index.html', {root: '../webpages'});
  console.log('index.html sent');
}
