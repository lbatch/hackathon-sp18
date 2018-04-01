import React from 'react';
import './Calendar.css'
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

const calendar = (props) => {
  let dates = [];
  let dayWithEvent = [];
  let datesSize = 41;
  let days = daysInAMonth(props.display.month, props.display.year);
  let firstDay = firstDayOfMonth(props.display.month, props.display.year);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  let dayCount = 0;
  for(let i = 0; i < datesSize; ++i) {
    if(i < firstDay || dayCount >= days) {
      dates[i] = '';
      dayWithEvent[i] = '';
    }
    else {
      dates[i] = ++dayCount;
      if(props.tasks) {
        let month = props.display.month;
        let year = props.display.year;
        for(let j = 0; j < props.tasks.length; ++j) {
          let item = props.tasks[j];
          let itemStartDate = new Date(item.startDate);
          let itemEndDate = new Date(item.endDate);
          if((itemStartDate.getMonth() === month && itemStartDate.getFullYear() === year && itemStartDate.getDate() === dayCount) ||
              (itemEndDate.getMonth() === month && itemEndDate.getFullYear() === year && itemEndDate.getDate() === dayCount)) {
            dayWithEvent[i] = ' day-highlight';
          }
        }

      }
      if(!dayWithEvent[i]) dayWithEvent[i] = '';
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
          <FlatButton className={"day" + dayWithEvent[0]} onClick={buttonClicked} label={dates[0]}/>
          <FlatButton className={"day" + dayWithEvent[1]} onClick={buttonClicked} label={dates[1]}/>
          <FlatButton className={"day" + dayWithEvent[2]} onClick={buttonClicked} label={dates[2]}/>
          <FlatButton className={"day" + dayWithEvent[3]} onClick={buttonClicked} label={dates[3]}/>
          <FlatButton className={"day" + dayWithEvent[4]} onClick={buttonClicked} label={dates[4]}/>
          <FlatButton className={"day" + dayWithEvent[5]} onClick={buttonClicked} label={dates[5]}/>
          <FlatButton className={"day" + dayWithEvent[6]} onClick={buttonClicked} label={dates[6]}/>
        </div>
        <div className="boardRow">
          <FlatButton className={"day" + dayWithEvent[7]} onClick={buttonClicked} label={dates[7]}/>
          <FlatButton className={"day" + dayWithEvent[8]} onClick={buttonClicked} label={dates[8]}/>
          <FlatButton className={"day" + dayWithEvent[9]} onClick={buttonClicked} label={dates[9]}/>
          <FlatButton className={"day" + dayWithEvent[10]} onClick={buttonClicked} label={dates[10]}/>
          <FlatButton className={"day" + dayWithEvent[11]} onClick={buttonClicked} label={dates[11]}/>
          <FlatButton className={"day" + dayWithEvent[12]} onClick={buttonClicked} label={dates[12]}/>
          <FlatButton className={"day" + dayWithEvent[13]} onClick={buttonClicked} label={dates[13]}/>
        </div>
      <div className="boardRow">
          <FlatButton className={"day" + dayWithEvent[14]} onClick={buttonClicked} label={dates[14]}/>
          <FlatButton className={"day" + dayWithEvent[15]} onClick={buttonClicked} label={dates[15]}/>
          <FlatButton className={"day" + dayWithEvent[16]} onClick={buttonClicked} label={dates[16]}/>
          <FlatButton className={"day" + dayWithEvent[17]} onClick={buttonClicked} label={dates[17]}/>
          <FlatButton className={"day" + dayWithEvent[18]} onClick={buttonClicked} label={dates[18]}/>
          <FlatButton className={"day" + dayWithEvent[19]} onClick={buttonClicked} label={dates[19]}/>
          <FlatButton className={"day" + dayWithEvent[20]} onClick={buttonClicked} label={dates[20]}/>
        </div>
        <div className="boardRow">
          <FlatButton className={"day" + dayWithEvent[21]} onClick={buttonClicked} label={dates[21]}/>
          <FlatButton className={"day" + dayWithEvent[22]} onClick={buttonClicked} label={dates[22]}/>
          <FlatButton className={"day" + dayWithEvent[23]} onClick={buttonClicked} label={dates[23]}/>
          <FlatButton className={"day" + dayWithEvent[24]} onClick={buttonClicked} label={dates[24]}/>
          <FlatButton className={"day" + dayWithEvent[25]} onClick={buttonClicked} label={dates[25]}/>
          <FlatButton className={"day" + dayWithEvent[26]} onClick={buttonClicked} label={dates[26]}/>
          <FlatButton className={"day" + dayWithEvent[27]} onClick={buttonClicked} label={dates[27]}/>
        </div>
        <div className="boardRow">
          <FlatButton className={"day" + dayWithEvent[28]} onClick={buttonClicked} label={dates[28]}/>
          <FlatButton className={"day" + dayWithEvent[29]} onClick={buttonClicked} label={dates[29]}/>
          <FlatButton className={"day" + dayWithEvent[30]} onClick={buttonClicked} label={dates[30]}/>
          <FlatButton className={"day" + dayWithEvent[31]} onClick={buttonClicked} label={dates[31]}/>
          <FlatButton className={"day" + dayWithEvent[32]} onClick={buttonClicked} label={dates[32]}/>
          <FlatButton className={"day" + dayWithEvent[33]} onClick={buttonClicked} label={dates[33]}/>
          <FlatButton className={"day" + dayWithEvent[34]} onClick={buttonClicked} label={dates[34]}/>
        </div>
        <div className="boardRow">
          <FlatButton className={"day" + dayWithEvent[35]} onClick={buttonClicked} label={dates[35]}/>
          <FlatButton className={"day" + dayWithEvent[36]} onClick={buttonClicked} label={dates[36]}/>
          <FlatButton className={"day" + dayWithEvent[37]} onClick={buttonClicked} label={dates[37]}/>
          <FlatButton className={"day" + dayWithEvent[38]} onClick={buttonClicked} label={dates[38]}/>
          <FlatButton className={"day" + dayWithEvent[39]} onClick={buttonClicked} label={dates[39]}/>
          <FlatButton className={"day" + dayWithEvent[40]} onClick={buttonClicked} label={dates[40]}/>
          <FlatButton className={"day" + dayWithEvent[41]} onClick={buttonClicked} label={dates[41]}/>
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
