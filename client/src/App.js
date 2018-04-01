import React, { Component } from 'react';
import Banner from './Banner';
import Calendar from './Calendar';
import './App.css'
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
      events[i].name = results["name" + i].value;
      events[i].duration = results["duration" + i].value;
      events[i].deadline = results["deadline" + i].value;
    }

    fetch("/api/test", {
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
          <div>
            <fieldset>
              <legend>Event Details</legend>
              <p>Title: <input type="text" name={"name" + key}/></p>
              <p>Duration (Hours): <input type="number" name={"duration" + key}/></p>
              <p>Deadline: <input type="date" name={"deadline" + key}/></p>
            </fieldset>
          </div>
        )
      });
      formInputs[formInputs.length] = (
        <div>
          <input type="submit"/>
          <button onClick={this.addEventHandler}>Add Event</button>
          <button onClick={this.removeEventHandler}>Remove Event</button>
        </div>
      )
    } else {
      formInputs = (<GoogleLogin
          clientId="472400227139-krcsj4li4oka1dspgdh3eckloi7ls1lc.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={this.successGoogle}
          onFailure={this.failGoogle}
        />
      )
    }

    return (
      <div>
        <Banner />
        <form name="eventForm" onSubmit={this.submitFormHandler}>
          {formInputs}
        </form>
        <Calendar display={this.state.displayMonth} tasks={this.state.tasks}/>
        <div>
          <button className="changeDisplay" onClick={this.lastMonthHandler}>Prev</button>
          <button className="changeDisplay" onClick={this.nextMonthHandler}>Next</button>
        </div>
      </div>
    );
  }
}


export default App;
