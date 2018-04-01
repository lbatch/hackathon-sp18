import React from 'react';
import './Calendar.css'
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

const calendar = (props) => {
  let dates = [];
  let datesSize = 41;
  let days = daysInAMonth(props.display.month, props.display.year);
  let firstDay = firstDayOfMonth(props.display.month, props.display.year);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  let dayCount = 0;
  for(let i = 0; i < datesSize; ++i) {
    if(i < firstDay || dayCount >= days) {
      dates[i] = '';
    }
    else {
      dates[i] = ++dayCount;
    }
  }

  const buttonClicked = (event) => {
    let month = props.display.month;
    let year = props.display.year;
    let display = '';
    if(props.tasks) {
      for(let j = 0; j < props.tasks.length; ++j) {
        let item = props.tasks[j];
        let itemStartDate = new Date(item.startDate);
        let itemEndDate = new Date(item.endDate);
        if(itemStartDate.getMonth() === month && itemStartDate.getFullYear() === year && itemStartDate.getDate() === parseInt(event.target.textContent, 10)) {
          let statement = '\n' + itemStartDate.toLocaleTimeString() + ' start ' + item.task;
          display += '<p>' + statement + '</p>';
        }
        if(itemEndDate.getMonth() === month && itemEndDate.getFullYear() === year && itemEndDate.getDate() === parseInt(event.target.textContent, 10)) {
          let statement = '\n' + itemEndDate.toLocaleTimeString() + ' end ' + item.task;
          display += '<p>' + statement + '</p>';
        }

      }
    }
    document.getElementById("eventDisplay").innerHTML = display;
  }

  return (
    <div className="calendar">
        <Subheader>Calendar</Subheader>
        <AppBar id="calendarHeader" showMenuIconButton={false} title={monthNames[props.display.month] + ' ' + props.display.year}/>
        <div className="boardRow">
          <FlatButton className="day" onClick={buttonClicked} label={dates[0]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[1]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[2]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[3]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[4]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[5]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[6]}/>
        </div>
        <div className="boardRow">
          <FlatButton className="day" onClick={buttonClicked} label={dates[7]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[8]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[9]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[10]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[11]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[12]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[13]}/>
        </div>
      <div className="boardRow">
          <FlatButton className="day" onClick={buttonClicked} label={dates[14]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[15]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[16]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[17]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[18]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[19]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[20]}/>
        </div>
        <div className="boardRow">
          <FlatButton className="day" onClick={buttonClicked} label={dates[21]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[22]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[23]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[24]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[25]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[26]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[27]}/>
        </div>
        <div className="boardRow">
          <FlatButton className="day" onClick={buttonClicked} label={dates[28]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[29]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[30]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[31]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[32]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[33]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[34]}/>
        </div>
        <div className="boardRow">
          <FlatButton className="day" onClick={buttonClicked} label={dates[35]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[36]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[37]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[38]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[39]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[40]}/>
          <FlatButton className="day" onClick={buttonClicked} label={dates[41]}/>
        </div>
        <div id='eventDisplay'></div>
    </div>
  )

}

const daysInAMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
}

const firstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
}

export default calendar;