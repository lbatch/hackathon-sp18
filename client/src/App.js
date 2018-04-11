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
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    super(props);
    this.state = {
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
      events[i].newEvent = true;
    }

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
        console.log(res);
        this.setState({
          ...this.state,
          tasks: [ ...this.state.tasks,
                  ...res
                ]
        });
      });
    event.preventDefault();
  }

  successGoogle = (response) => {
    this.setState({
      ...this.state,
      token: response.getAuthResponse().access_token,
      signedIn: true
    });

    var params = "maxResults=500"; // put any query parameters here in string format
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
          for (var i = 0; i < data.items.length; i++) // for each event returned
          {
            if (data.items[i].startDate) { // skip weird 'undefined' events
              prevEvents[i] = {};
              prevEvents[i].startDate = data.items[i].start.dateTime || data.items[i].start.date;
              prevEvents[i].endDate = data.items[i].end.dateTime || data.items[i].end.date;;
              prevEvents[i].task = data.items[i].summary;
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
          <Calendar display={this.state.displayMonth} tasks={this.state.tasks}/>
          <div>
            <RaisedButton className="changeDisplay" onClick={this.lastMonthHandler} label="Prev" style={{marginTop: '1rem', marginBottom: '1rem', marginRight: '1rem'}} secondary={true} />
            <RaisedButton className="changeDisplay" onClick={this.nextMonthHandler} label="Next" style={{marginTop: '1rem', marginBottom: '1rem', marginRight: '1rem'}} secondary={true}/>
          </div>
        </Paper>
        {submitSignOutButtons}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
