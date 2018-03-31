import React from 'react';
import './Calendar.css'


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
      <h1>{monthNames[props.display.month]} {props.display.year}</h1>
      <div className="boardRow">
        <button className="day" onClick={buttonClicked}>{dates[0]}</button>
        <button className="day" onClick={buttonClicked}>{dates[1]}</button>
        <button className="day" onClick={buttonClicked}>{dates[2]}</button>
        <button className="day" onClick={buttonClicked}>{dates[3]}</button>
        <button className="day" onClick={buttonClicked}>{dates[4]}</button>
        <button className="day" onClick={buttonClicked}>{dates[5]}</button>
        <button className="day" onClick={buttonClicked}>{dates[6]}</button>
      </div>
      <div className="boardRow">
        <button className="day" onClick={buttonClicked}>{dates[7]}</button>
        <button className="day" onClick={buttonClicked}>{dates[8]}</button>
        <button className="day" onClick={buttonClicked}>{dates[9]}</button>
        <button className="day" onClick={buttonClicked}>{dates[10]}</button>
        <button className="day" onClick={buttonClicked}>{dates[11]}</button>
        <button className="day" onClick={buttonClicked}>{dates[12]}</button>
        <button className="day" onClick={buttonClicked}>{dates[13]}</button>
      </div>
    <div className="boardRow">
        <button className="day" onClick={buttonClicked}>{dates[14]}</button>
        <button className="day" onClick={buttonClicked}>{dates[15]}</button>
        <button className="day" onClick={buttonClicked}>{dates[16]}</button>
        <button className="day" onClick={buttonClicked}>{dates[17]}</button>
        <button className="day" onClick={buttonClicked}>{dates[18]}</button>
        <button className="day" onClick={buttonClicked}>{dates[19]}</button>
        <button className="day" onClick={buttonClicked}>{dates[20]}</button>
      </div>
      <div className="boardRow">
        <button className="day" onClick={buttonClicked}>{dates[21]}</button>
        <button className="day" onClick={buttonClicked}>{dates[22]}</button>
        <button className="day" onClick={buttonClicked}>{dates[23]}</button>
        <button className="day" onClick={buttonClicked}>{dates[24]}</button>
        <button className="day" onClick={buttonClicked}>{dates[25]}</button>
        <button className="day" onClick={buttonClicked}>{dates[26]}</button>
        <button className="day" onClick={buttonClicked}>{dates[27]}</button>
      </div>
      <div className="boardRow">
        <button className="day" onClick={buttonClicked}>{dates[28]}</button>
        <button className="day" onClick={buttonClicked}>{dates[29]}</button>
        <button className="day" onClick={buttonClicked}>{dates[30]}</button>
        <button className="day" onClick={buttonClicked}>{dates[31]}</button>
        <button className="day" onClick={buttonClicked}>{dates[32]}</button>
        <button className="day" onClick={buttonClicked}>{dates[33]}</button>
        <button className="day" onClick={buttonClicked}>{dates[34]}</button>
      </div>
      <div className="boardRow">
        <button className="day" onClick={buttonClicked}>{dates[35]}</button>
        <button className="day" onClick={buttonClicked}>{dates[36]}</button>
        <button className="day" onClick={buttonClicked}>{dates[37]}</button>
        <button className="day" onClick={buttonClicked}>{dates[38]}</button>
        <button className="day" onClick={buttonClicked}>{dates[39]}</button>
        <button className="day" onClick={buttonClicked}>{dates[40]}</button>
        <button className="day" onClick={buttonClicked}>{dates[41]}</button>
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
