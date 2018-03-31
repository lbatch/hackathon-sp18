const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/main', (req, res) => {
    console.log("Success");
});

app.get('/auth', (req, res) => {
    const fs = require('fs');
    const mkdirp = require('mkdirp');
    const readline = require('readline');
    const google = require('googleapis');
    const OAuth2Client = google.auth.OAuth2;
    const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    const TOKEN_PATH = 'credentials.json';

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorize(JSON.parse(content), listEvents);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return callback(err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) console.error(err);
            console.log('Token stored to', TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }

    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listEvents(auth) {
      const calendar = google.calendar({version: 'v3', auth});
      calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });
        } else {
          console.log('No upcoming events found.');
        }
      });
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on ${port}`);

const tools = require('./tools.js');

// --- getEvents ---
// Gets a list of events from the user's calendar and returns an array of Block
// objects (representing non-free time) for use with the methods in tools.js;
// note: the returned array will be empty if no upcoming events exist
function getEvents(startDate, endDate) {
    gapi.client.calendar.events.list({ // API call
      'calendarId': 'primary',
      'timeMin': startDate,
      'timeMax': endDate,
      'singleEvents': true,
      'orderBy': 'startTime'
    }).then(function(response) { // callback
      var events = response.result.items;
      var eventArray = new Array();

      if (events.length > 0) { // upcoming events found
        for (i = 0; i < events.length; i++) {
          var event = events[i];

          var whenStart = event.start.dateTime;
          if (!whenStart) {
            whenStart = event.start.date;
          }
          var whenEnd = event.end.dateTime;
          if (!whenEnd) {
            whenEnd = event.end.date;
          }

          var newEvent = new tools.Block(whenStart, whenEnd);
          eventArray.push(newEvent); // add each event to array as Block object
        }
      }
      return eventArray; // return array of Block objects (occupied time slots)
    });
}
