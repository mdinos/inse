// test function to ensure the QUnit tests are working properly
function isEven(n) {
    if (n % 2 == 0) {
        return true;
    }
    else {
        return false;
    }
};

// Function performed when a user signs in with the Google button.
function onSignIn(googleUser) {
  let auth2 = gapi.auth2.getAuthInstance();
  // Uses local storage to store the session ID token of the user.
  localStorage.setItem("id_token",auth2.currentUser.get().getAuthResponse().id_token);
  auth2.disconnect();


  // Server is called once user is authorized and token is stored.
  callServer(googleUser);
}


async function callServer(googleUser) {
  const token = localStorage.getItem("id_token");

  // Options used when calling /api/ functios.
  const fetchOptions = {
    //credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };

  const response = await fetch('/api/login', fetchOptions);
  if (!response.ok) {
    // handle the error
    console.log("fetch response for /api/login has failed.");
    return;
  }

  // handle the response
  console.log("/api/login successful");
  let innerhtml = await response.text();

  // InnerHTML of the document is changed.
  document.documentElement.innerHTML = innerhtml;

  // Function called once user accesses the main page.
  populateMain(googleUser);
  //$('html').innerHTML = innerhtml;
}

async function populateMain(googleUser) {
  // Personal 'greeting' in the header of the page.
  const profile = googleUser.getBasicProfile();
  const el = document.getElementById('greeting');
  el.textContent = ' – Hello ' + profile.getName() + '!';

  const token = localStorage.getItem("id_token");
  const fetchOptions = {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
  };

  const response = await fetch('/api/checkuser', fetchOptions);
  if (!response.ok) {
    // handle the error
    console.log("fetch response for /api/checkuser has failed.");
    return;
  }

  console.log("insertion into db successful");
  // check database to see if this user has records (with emaik)
    // if yes then load content`
    // if not then create fields!

  // populate me!
}

async function signOut() {
  // Gets token from localStorage
  const token = localStorage.getItem("id_token");
  let auth2 = gapi.auth2.getAuthInstance();

  // Fetch options for server API function call.
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };

  const response = await fetch('/api/logout', fetchOptions);

  // Handle failure.
  if (!response.ok) {
    console.log("fetch reponse for /api/logout has failed.");
    return;
  }

  // Handle success: innerHTML is changed back to index.html
  let innerhtml = await response.text();
  console.log(innerhtml);
  document.documentElement.innerHTML = innerhtml;

  window.location.reload();

  // Token is removed from localStorage.
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
    // Function which takes the entries of the createEvent page, and creates an event from them.
    let eventName = document.getElementById('eventName').value;
    let eventDescription = document.getElementById('eventDescription').value;
    let testBalance = parseInt(document.getElementById('totalSpent').value);
    let _emails = document.getElementById('emaillist').children;
    let emails = [];

    // Runs a validation function on the entries of this page.
    let eventStatus = validateEntries();

    // Based on the success of the validation, the following code is performed or not:
    if (eventStatus == true) {
      for (i = 0; i < _emails.length; i++) {
          emails.push(_emails[i].innerHTML);
      }

      // Server function is called, which is used to create the event.
      let url = '/api/makeevent';
      const _token = localStorage.getItem("id_token");

      // These credentials are sent to the server function, used to create the event.
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

    // If the email entered is valid (validated by function below)
    if (validationStatus == true) {
      // New HTML element is created to display a list of valid emails entered by the user.
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
  // Use of regex to validate the syntax of emails enterd by the user.
  // It makes sure that all emails have ___@___.___ format (or similar, 2 '.' allowed after @
  // for example.)
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
    // true or false returned based on this test
}

function validateEntries() {
  // Event is true by default, but will change if tests are failed.
  let isValid = true;

  // Gets element values to be validated.
  let _emails = document.getElementById('emaillist').children;
  let eventName = document.getElementById('eventName').value;
  let testBalance = parseInt(document.getElementById('totalSpent').value);

  // note:
  // find replacement for "_emails.length < 2", so that an event is able
  // to have 1 email (instead of rn forced to have 2).

  // Checks if there are any emails in the event.
  if ( _emails.length < 2) {
    alert("Please enter user emails for this event!");
    isValid = false;
  }

  // Checks if the event has a name.
  if (eventName.length < 1) {
    alert("Please enter a name for this event!");
    isValid = false;
  }

  // Checks if the event has a valid cost.
  if (testBalance < 1) {
    alert("Please enter the cost of this event!");
    isValid = false;
  }
  console.log("validity before being sent: " + isValid);
  return isValid;
}
