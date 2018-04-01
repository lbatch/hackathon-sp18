import React from 'react';
import './Banner.css';
import AppBar from 'material-ui/AppBar';

const banner = (props) => {
  return (
    <div className="App">
      <AppBar
        title="Optimus Time"
        showMenuIconButton={false} />
      <header className="App-header">
	      <p className="App-intro">Optimus Time is a task management helper app for Google Calendar.</p>
	      <p className="App-intro">Enter your upcoming tasks using the form below, then click Submit to have Optimus Time automatically assign your tasks time slots based on your availability.</p>
	      <p className="App-intro">Review added tasks in the calendar at the bottom of the app.</p>
      </header>
    </div>
  )
}

export default banner;