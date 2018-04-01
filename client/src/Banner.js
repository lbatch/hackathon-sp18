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
        <p className="App-intro">
          ...Instructions Here...
        </p>
      </header>
    </div>
  )
}

export default banner;
