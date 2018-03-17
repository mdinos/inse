'use-strict';

// Testing the testing stuff - Should always pass
QUnit.test('isEven()', function(assert) {
    assert.ok(isEven(0), 'Zero is an even number');
    assert.ok(isEven(4), 'Four is an even number');
    assert.ok(!isEven(7), 'Seven is odd');
    assert.ok(!isEven(-3), ' -3 is odd');
    assert.ok(isEven(-10), ' -10 is even');
});

// Testing the page delivery system for pages after logon
QUnit.module("Testing validation of entries in makeEvent, validateEmail, and validateEntries");
QUnit.test('validateEmail()', function(assert) {
   let emails = [
       {  
           "email": "m@b.com",
           "ok": true,
           "response": "Valid email address, should return true"
       },
       {
           "email": "c@@g.com",
           "ok": false,
           "response": "Two @ symbols, should return false"
       },
       {
           "email": "BBB.com",
           "ok": false,
           "response": "Not an email address, should return false"
       },
       {
           "email": "Just words",
           "ok": false,
           "response": "Not an email address, should return false"
       },
       {
           "email": "m@.com",
           "ok": false,
           "response": "No site address, should return false"
       },
       {
           "email": "",
           "ok": false,
           "response": "Empty string should return false"
       },
       {
           "email": 12345,
           "ok": false,
           "response": "Integer input should return false"
       },
       {
           "email": "@g.com",
           "ok": false,
           "response": "No address at site, should return false"
       },
       {
           "email": true,
           "ok": false,
           "response": "Boolean input, should return false"
       },
       {
           "email": "m@g.",
           "ok": false,
           "response": "No site address, should return false"
       },
       {
           "email": "email.with.dots@gmail.com",
           "ok": true,
           "response": "Should return true, dots should be ok"
       }
       ]
   for (let i = 0; i < emails.length; i++) {
       let funcCheck = "";
       if (emails[i].ok == false)
           funcCheck += "!"
       funcCheck += "validateEmail(emails[i].email)";
       assert.ok(funcCheck, emails[i].response + ". Email was: " + emails[i].email);
   }
});
// TODO Find a way to get a logon token to test the rest of the functions
