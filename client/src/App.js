import React, { Component } from 'react';
import Banner from './Banner';
import Calendar from './Calendar';
import './App.css'

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
      numOfEvents: 3
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
    console.log(events);
    event.preventDefault();
  }

  render() {
    let arrayOfKeys = new Array(this.state.numOfEvents);
    for(let i = 0; i < this.state.numOfEvents; ++i) {
      arrayOfKeys[i] = i;
    }
    let formInputs = arrayOfKeys.map( key => {
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

    return (
      <div>
        <Banner />
        <form name="eventForm" onSubmit={this.submitFormHandler}>
          {formInputs}
          <input type="submit"/>
          <button onClick={this.addEventHandler}>Add Event</button>
          <button onClick={this.removeEventHandler}>Remove Event</button>
        </form>
        <Calendar display={this.state.displayMonth}/>
        <div>
          <button className="changeDisplay" onClick={this.lastMonthHandler}>Prev</button>
          <button className="changeDisplay" onClick={this.nextMonthHandler}>Next</button>
        </div>
      </div>
    );
  }
}


export default App;
