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
      }
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

  render() {
    return (
      <div>
        <Banner />
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
