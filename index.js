const express = require('express');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const google = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'credentials.json';
const tools = require('./tools.js');

const app = express();

var eventArray = new Array();
var workArray = new Array();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/auth', (req,res) => {
    fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API
    var today = new Date();
    var startDate = today.toISOString();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var d = new Date(year + 1, month, day)
    var endDate = d.toISOString();
    authorize(JSON.parse(content), getEvents, taskAssignment);
    res.set('Content-Type', 'text/plain');
    res.send(`Success`);
  });
});

/**
  * Create an OAuth2 client with the given credentials, and then execute the
  * given callback function.
  * @param {Object} credentials The authorization client credentials.
  * @param {function} callback The callback to call with the authorized client.
*/
function authorize(credentials, callback, callback2) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, callback2);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, callback2) {
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
      callback(oAuth2Client, callback2);
    });
  });
}

/**
 * Gets the next 500 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getEvents(auth, callback) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 500,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;
    if (events.length) {
      for(let event of events)
      {
        var start = event.start.dateTime || event.start.date;
        var end = event.end.dateTime || event.end.date;
        var newEvent =  new Block(start, end);
        eventArray.push(newEvent); // add each event to array as Block object
      }
      callback();
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function insertEvents(auth, callback)
{
  const calendar = google.calendar({version: 'v3', auth});
  for(let block of workArray)
  {
    console.log(block);
  }
  for(let block of workArray)
  {
    console.log(block.startDate.toISOString());
    console.log(block.endDate.toISOString());
    
    var event = {
      'summary': block.task,
      'start': {
        'dateTime': block.startDate
      },
      'end': {
        'dateTime': block.endDate
      },
      'reminders': {
        'useDefault': true
      }
    }
    
    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event){
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created!');
    });
  }
  callback();
}

function success()
{
  console.log("Creating events");
}

app.get('/api/main', (req, res) => {
    console.log("Success");
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});








// ****** TOOLS ******* //
Date.prototype.addMinutes = function(m) 
{    
   this.setTime(this.getTime() + (m*60*1000)); 
   return this;   
}

/* Convert API-formatted date to JS-compatible format */
/* This and the below ended up being simpler than expected so may not be necessary */
function date_APItoJS(apiDate)
{
    var date = new Date(apiDate);
    return date;
}

/* Convert JS-formatted date to API-compatible format */
function date_JStoAPI(jsDate)
{
    return jsDate.toISOString();
}

/* Block object for blocks of free time */
function Block(start, end) 
{
    this.startDate = new Date(start);
    this.endDate = new Date(end);
}

Block.prototype.duration = function() 
{
    var dur = this.endDate - this.startDate; 
    return dur / 1000 / 60 / 60;
}

/* WorkBlock item for task-completion appointments to add to calendar */
function WorkBlock(task, start, end) 
{
    this.startDate = start;
    this.endDate = end;
    this.task = task;
}

/* Task object for list of tasks */
function Task(title, duration, deadline) 
{
    this.title = title;
    this.duration = duration;
    this.deadline = new Date(deadline);
    this.remDuration = duration;
}

/* Function to take list of appointments from calendar and determine blocks of free time */
function detFreeTime(appointments)
{
    var freeBlocks = new Array();
    
    var curStartDate = new Date(); // Start at least 30 minutes from now, since we're in planning mode
    curStartDate.addMinutes(30);
    var curEndDate = new Date(appointments[0].startDate);

    for (let curAppt of appointments)
    {
        curEndDate = new Date(curAppt.startDate); // For the first block, the currentAppt start date is at least 30 minutes from now, start the first block of
                                        // free time 30 min from now and end it at the next appt
        var minEndDate = new Date(curStartDate);
        minEndDate.addMinutes(30);
        if(curEndDate >= minEndDate) // Don't use a block of time less than 30 minutes long; keep iterating until you find space
        {
            var curBlock = new Block(curStartDate, curEndDate);
            freeBlocks.push(curBlock);
        }
        
        curStartDate = new Date(curAppt.endDate);
    }
    curEndDate = new Date(curStartDate);
    curEndDate.addMinutes(360);
    curBlock = new Block(curStartDate, curEndDate);
    freeBlocks.push(curBlock);
    return freeBlocks;
}

function blockSelection(tasks, freeBlocks)
{
    var workBlocks = new Array();
    
    tasks.sort(function(a,b){
        return new Date(a.deadline) - new Date(b.deadline);
    });
    
    freeBlocks.sort(function(a,b){
        return new Date(a.startDate) - new Date(b.startDate);
    });
    

    for (let curTask of tasks)
    {
        while(curTask.duration > 0)
        {
            var minDuration = curTask.duration;
            var blockDuration = freeBlocks[0].duration();
            if(blockDuration < minDuration)
                minDuration = blockDuration;
            var startDate = new Date(freeBlocks[0].startDate);
            var endDate = new Date(startDate);
            endDate.addMinutes(minDuration*60);
            var curWork = new WorkBlock(curTask.title, startDate, endDate);
            workBlocks.push(curWork);
            curTask.duration = curTask.duration - minDuration;
            var compareDate = new Date(endDate);
            compareDate.addMinutes(30);
            freeBlocks[0].startDate = new Date(endDate);
            if (compareDate >= freeBlocks[0].endDate)
                freeBlocks.splice(0,1);
        }
    }
    return workBlocks;
}

function generateWorkBlocks(tasks, appointments)
{
    var freeBlocks = detFreeTime(appointments);
    workArray = blockSelection(tasks, freeBlocks);
    fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API
    authorize(JSON.parse(content), insertEvents, success);
  });
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on ${port}`);