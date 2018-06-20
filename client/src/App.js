// Main front-end page that brings together the various components (UI, calendar,
// login/logout, etc.) and makes calls to Google API

import React, { Component } from 'react';
import Banner from './Banner';
import Calendar from './Calendar';
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; // for Material-UI theme
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

class App extends Component {
  constructor(props) {
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    super(props);
    this.state = {
      today: today,
      displayMonth: {
        month: currentMonth,
        year: currentYear
      },
      numOfEvents: 1,
      signedIn: false
    };
  }

  lastMonthHandler = () => {
    let newMonth;
    let newYear = this.state.displayMonth.year;
    if(this.state.displayMonth.month === 0) {
      newMonth = 11;
      newYear = this.state.displayMonth.year - 1;
    } else {
      newMonth = this.state.displayMonth.month - 1;
    }
    this.setState({
      ...this.state,
      displayMonth: {
        month: newMonth,
        year: newYear
      }
    });
  }

  nextMonthHandler = () => {
    let newMonth;
    let newYear = this.state.displayMonth.year;
    if(this.state.displayMonth.month === 11) {
      newMonth = 0;
      newYear = this.state.displayMonth.year + 1;
    } else {
      newMonth = this.state.displayMonth.month + 1;
    }
    this.setState({
      ...this.state,
      displayMonth: {
        month: newMonth,
        year: newYear
      }
    });
  }

  addEventHandler = (event) => {
    let newNumOfEvents = this.state.numOfEvents + 1;
    this.setState({
      ...this.state,
      numOfEvents: newNumOfEvents
    });
    event.preventDefault();
  }

  removeEventHandler = (event) => {
    let newNumOfEvents = this.state.numOfEvents === 0 ? 0 : this.state.numOfEvents - 1;
    this.setState({
      ...this.state,
      numOfEvents: newNumOfEvents
    });
    event.preventDefault();
  }

  submitFormHandler = (event) => {
    let events = [];
    let results = document.forms['eventForm'];
    for(let i = 0; i < this.state.numOfEvents; ++i) {
      events[i] = {};
      events[i].title = results["name" + i].value;
      events[i].duration = results["duration" + i].value;
      events[i].deadline = results["deadline" + i].value;
    }

    // Send tasks and existing events to back-end and receive allocated time
    // slots for tasks
    fetch("/api/main", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: this.state.tasks,
        tasks: events
      })
    }).then(res => res.json())
      .then(res => {
        for (var i = 0; i < res.length; i++)
        {
          res[i].newEvent = true; // distinguish from previously existing events
        }

        // Append newly allocated tasks to existing events, so this.state.tasks
        // contains both user's preexisting events and allocated to-do items
        this.setState({
          ...this.state,
          tasks: [ ...this.state.tasks,
                  ...res
                ]
        });
        
        this.state.tasks.sort(function(a,b) {
          return new Date(a.startDate) - new Date(b.startDate);
          }); // sort all tasks (new and old) by start date for neater display
      });
      
    event.preventDefault();
  }

  // Authentication successful, continue to retrieval of calendar events
  successGoogle = (response) => {
    this.setState({
      ...this.state,
      token: response.getAuthResponse().access_token,
      signedIn: true
    });

    var now = new Date();
    var params = "maxResults=500"
                  + "&singleEvents=true"
                  + "&orderBy=startTime"
                  + "&timeMin=" + now.toISOString(); // query parameters

    // Get list of existing events from Google Calendar
    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?" + params, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+ this.state.token,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(data => {
        let prevEvents = [];
        if(data.items) {
          var j = 0; // destination index
          for (var i = 0; i < data.items.length; i++) // for each event returned
          {
            if (data.items[i].start) { // skip mysterious 'undefined' events
              prevEvents[j] = {};
              prevEvents[j].startDate = data.items[i].start.dateTime || data.items[i].start.date;
              prevEvents[j].endDate = data.items[i].end.dateTime || data.items[i].end.date;
              prevEvents[j].task = data.items[i].summary;
              prevEvents[j].newEvent = false; // distinguish from events to be created
              j++; // iterate destination only if we added the event;
                   // this is to prevent gaps when skipping undefined events
            }
          }
        }
        this.setState({
          ...this.state,
          tasks: prevEvents
        });
      });
  }

  failGoogle = (response) => {
    console.log(response);
  }

  logout = () => {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    this.setState({
      displayMonth: {
        month: currentMonth,
        year: currentYear
      },
      numOfEvents: 1,
      tasks: [],
      signedIn: false
    });
    document.getElementById("eventDisplay").innerHTML = '';
  }

  insertEventsHandler = () => {
    let eventsToInsert = this.state.tasks.filter(event => event.newEvent);
    console.log(eventsToInsert);
  };

  render() {
    let formInputs;
    let submitSignOutButtons;
    let arrayOfKeys = new Array(this.state.numOfEvents);

    if(this.state.signedIn) {
      submitSignOutButtons = (
        <div>
          <RaisedButton onClick={this.insertEventsHandler} label="Store Events in Google Calendar" style={{marginLeft: '1rem'}} primary={true} />
          <div id="logout-button">
            <GoogleLogout
              buttonText="Logout"
              onLogoutSuccess={this.logout}
              />
          </div>
        </div>
      );
      for(let i = 0; i < this.state.numOfEvents; ++i) {
        arrayOfKeys[i] = i;
      }
      formInputs = arrayOfKeys.map( key => {
        return (
          <Paper
            style={{margin: '1rem', paddingLeft: '1rem', paddingRight: '1rem', display: 'inline-block'}}
            zDepth={1}
            key={'Event'+key}
          >
            <fieldset>
              <Subheader>Event Details</Subheader>
              <p/>Title: <TextField hintText="name of the task" type="text" name={"name" + key}/>
              <p/>Duration: <TextField hintText="hours needed to complete" type="number" name={"duration" + key}/>
              <p/>Deadline: <TextField type="date" name={"deadline" + key}/>
            </fieldset>
          </Paper>
        )
      });
      formInputs[formInputs.length] = (
        <div key='EventButtons'>
          <RaisedButton type="submit" label="Submit" style={{marginLeft: '1rem'}} primary={true} />
          <RaisedButton onClick={this.addEventHandler} label="Add Event" style={{marginLeft: '1rem'}} />
          <RaisedButton onClick={this.removeEventHandler} label="Remove Event" style={{marginLeft: '1rem'}} />
        </div>
      )
    } else {
      formInputs = (<div id="login-button">
          <GoogleLogin
            clientId="472400227139-krcsj4li4oka1dspgdh3eckloi7ls1lc.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={this.successGoogle}
            onFailure={this.failGoogle}
            scope="https://www.googleapis.com/auth/calendar"
            />
        </div>
      )
    }

    return (
      <MuiThemeProvider>
      <div>
        <Banner />
        <form name="eventForm" onSubmit={this.submitFormHandler}>
          {formInputs}
        </form>
        <Paper style={{marginTop: '2rem', marginLeft: '1rem', marginRight: '1rem', marginBottom: '1rem', paddingLeft: '1rem', paddingRight: '1rem', display: 'inline-block'}} zDepth={1}>
          <Calendar display={this.state.displayMonth} tasks={this.state.tasks} today={this.state.today}/>
          <div>
            <RaisedButton
              className="changeDisplay"
              onClick={this.lastMonthHandler}
              label="Prev"
              style={{marginTop: '1rem', marginBottom: '1rem', marginRight: '1rem'}}
              backgroundColor = "#FBC02D"
              labelColor = "#FFFFFF" />
            <RaisedButton
              className="changeDisplay"
              onClick={this.nextMonthHandler}
              label="Next"
              style={{marginTop: '1rem', marginBottom: '1rem', marginRight: '1rem'}}
              backgroundColor = "#FBC02D"
              labelColor = "#FFFFFF" />
          </div>
        </Paper>
        {submitSignOutButtons}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
