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

  return (
    <div className="calendar">
      <h1>{monthNames[props.display.month]} {props.display.year}</h1>
      <div className="boardRow">
        <button className="day">{dates[0]}</button>
        <button className="day">{dates[1]}</button>
        <button className="day">{dates[2]}</button>
        <button className="day">{dates[3]}</button>
        <button className="day">{dates[4]}</button>
        <button className="day">{dates[5]}</button>
        <button className="day">{dates[6]}</button>
      </div>
      <div className="boardRow">
        <button className="day">{dates[7]}</button>
        <button className="day">{dates[8]}</button>
        <button className="day">{dates[9]}</button>
        <button className="day">{dates[10]}</button>
        <button className="day">{dates[11]}</button>
        <button className="day">{dates[12]}</button>
        <button className="day">{dates[13]}</button>
      </div>
    <div className="boardRow">
        <button className="day">{dates[14]}</button>
        <button className="day">{dates[15]}</button>
        <button className="day">{dates[16]}</button>
        <button className="day">{dates[17]}</button>
        <button className="day">{dates[18]}</button>
        <button className="day">{dates[19]}</button>
        <button className="day">{dates[20]}</button>
      </div>
      <div className="boardRow">
        <button className="day">{dates[21]}</button>
        <button className="day">{dates[22]}</button>
        <button className="day">{dates[23]}</button>
        <button className="day">{dates[24]}</button>
        <button className="day">{dates[25]}</button>
        <button className="day">{dates[26]}</button>
        <button className="day">{dates[27]}</button>
      </div>
      <div className="boardRow">
        <button className="day">{dates[28]}</button>
        <button className="day">{dates[29]}</button>
        <button className="day">{dates[30]}</button>
        <button className="day">{dates[31]}</button>
        <button className="day">{dates[32]}</button>
        <button className="day">{dates[33]}</button>
        <button className="day">{dates[34]}</button>
      </div>
      <div className="boardRow">
        <button className="day">{dates[35]}</button>
        <button className="day">{dates[36]}</button>
        <button className="day">{dates[37]}</button>
        <button className="day">{dates[38]}</button>
        <button className="day">{dates[39]}</button>
        <button className="day">{dates[40]}</button>
        <button className="day">{dates[41]}</button>
      </div>
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
