// test function to ensure the QUnit tests are working properly
function isEven(n) {
    if (n % 2 == 0) {
        return true;
    }
    else {
        return false;
    }
};

function onSignIn(googleUser) {

  let auth2 = gapi.auth2.getAuthInstance();
  localStorage.setItem("id_token",auth2.currentUser.get().getAuthResponse().id_token);
  auth2.disconnect();
  console.log("id_token:");
  console.log(localStorage.id_token);

  callServer(googleUser);
}

async function callServer(googleUser) {
  const token = localStorage.getItem("id_token");
  console.log("call server's ID token: ");
  console.log(token);

  const fetchOptions = {
    //credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };

  console.log("fetch options for api/login: ");
  console.log(fetchOptions);

  const response = await fetch('/api/login', fetchOptions);
  if (!response.ok) {
    // handle the error
    console.log("fetch response for /api/login has failed.");
    return;
  }

  // handle the response
  console.log("/api/login successful");
  let innerhtml = await response.text();
  console.log("innerhtml:")
  console.log(innerhtml);
  document.documentElement.innerHTML = innerhtml;

  populateMain(googleUser);
  //$('html').innerHTML = innerhtml;
}

async function populateMain(googleUser) {
  const profile = googleUser.getBasicProfile();
  const el = document.getElementById('greeting');
  el.textContent = ' – Hello ' + profile.getName() + '!';

  // check database to see if this user has records (with emaik)
    // if yes then load content`
    // if not then create fields!

  // populate me!
}

async function signOut() {
  console.log("entered function");
  const token = localStorage.getItem("id_token");
  let auth2 = gapi.auth2.getAuthInstance();

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };

  const response = await fetch('/api/logout', fetchOptions);

  if (!response.ok) {
    console.log("fetch reponse for /api/logout has failed.");
    return;
  }

  let innerhtml = await response.text();
  console.log(innerhtml);
  document.documentElement.innerHTML = innerhtml;

  window.location.reload();

  localStorage.removeItem("id_token");
}

// Function which grabs data from create event page, and converts them to JSON format, exporting them to an array on the server.

async function deliver(page) {
    page += ".html";
    const token = localStorage.getItem("id_token");
    let auth2 = gapi.auth2.getAuthInstance();
    
    const fetchOptions = {
        credentials: 'same-origin',
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    };
    
    let url = '/api/deliver';
    
    url += '?page=' + page;
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
        console.log("fetch response for api/deliver has failed");
        return
    }
    let innerhtml = await response.text();
    console.log("innerhtml:")
    console.log(innerhtml);
    document.documentElement.innerHTML = innerhtml;
    
}

async function makeEvent() {
    let eventName = document.getElementById('eventName').value;
    let eventDescription = document.getElementById('eventDescription').value;
    let testBalance = parseInt(document.getElementById('totalSpent').value);
    let _emails = document.getElementById('emaillist').children;
    let emails = [];

    let eventStatus = validateEntries();
    console.log("Status of this event: " + eventStatus);

    if (eventStatus == true) {
      for (i = 0; i < _emails.length; i++) {
          emails.push(_emails[i].innerHTML);
      }

      let url = '/api/makeevent';
      const _token = localStorage.getItem("id_token");

      url += '?eventName=' + eventName;
      url += '&eventDesc=' + eventDescription;
      url += '&testBalance=' + testBalance;
      url += '&emails=' + emails;

      const _fetchOptions = {
          credentials: 'same-origin',
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + _token },
      };

      const response = await fetch(url, _fetchOptions);

      if (!response.ok) {
          console.log("fetch for /api/makeevent' has failed");
          return;
      }
      alert("Database updated!");
    } else {
      alert("Database not updated!");
      return;
    }

}

// function to add another email to event, makes current emails appear in list below input box
function addEmail() {
    let email = document.getElementById('emailin');
    let container = document.getElementById('emaillist');

    // validate email input - DONE
    // if email in database
    // then proceed
    // else send invite

    let validationStatus = validateEmail (email.value);

    if (validationStatus == true) {
      let displayEmail = document.createElement('li');
      container.appendChild(displayEmail);
      displayEmail.innerHTML = email.value;
      email.value = "";

      let item = container.children;

      if (item[0].innerHTML == "No emails to display") {
          container.removeChild(item[0]);
      }
      return false;
    } else {
      return false;
    }


}

function validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
}

function validateEntries() {
  let isValid = true;

  let _emails = document.getElementById('emaillist').children;
  let eventName = document.getElementById('eventName').value;
  let testBalance = parseInt(document.getElementById('totalSpent').value);

  // note:
  // find replacement for "_emails.length < 2", so that an event is able
  // to have 1 email (instead of rn forced to have 2).

  if ( _emails.length < 2) {
    alert("Please enter user emails for this event!");
    isValid = false;
  }

  if (eventName.length < 1) {
    alert("Please enter a name for this event!");
    isValid = false;
  }

  if (testBalance < 1) {
    alert("Please enter the cost of this event!");
    isValid = false;
  }
  console.log("validity before being sent: " + isValid);
  return isValid;
}
