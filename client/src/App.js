import React, { Component } from 'react';
import Banner from './Banner';
import Calendar from './Calendar';
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; // for Material-UI theme
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import GoogleLogin from 'react-google-login';

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
    }

    fetch("/auth", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.token,
        tasks: events
      })
    }).then(res => res.json())
      .then(res => console.log(res));

    this.setState({
      ...this.state,
      tasks: [ {
              	startDate: '2018-04-01T12:44:39.000Z',
              	endDate: '2018-04-01T15:44:39.000Z',
              	task: 'do shit'
              }
            ]
    });
    event.preventDefault();
  }

  successGoogle = (response) => {
    this.setState({
      ...this.state,
      token: response.getAuthResponse().id_token,
      signedIn: true
    });
  }

  failGoogle = (response) => {
    console.log(response);
  }

  render() {
    let formInputs
    let arrayOfKeys = new Array(this.state.numOfEvents);

    if(this.state.signedIn) {
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
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
