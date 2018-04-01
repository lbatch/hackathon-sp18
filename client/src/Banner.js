import React from 'react';
import './Banner.css';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import DialogIcon from './Banner-Dialog.js'

const banner = (props) => {
  return (
    <div className="App">
      <AppBar
        title="Optimus Time"
        showMenuIconButton={false}
        iconElementRight={<IconButton>
          <DialogIcon />
        </IconButton>}
         />
      <header className="App-header">
        <p className="App-intro"><b>Optimus Time</b> easily adds tasks to Google Calendar based on upcoming available time slots.</p>
      </header>
    </div>
  )
}

export default banner;