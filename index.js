const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/main', (req, res) => {
    console.log("Success");
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on ${port}`);

const tools = require('tools.js');

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