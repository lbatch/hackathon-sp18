import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class DialogIcon extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div onClick={this.handleOpen}>
        <FontIcon
          className="material-icons"
          style={{color: 'white'}}>
            ?
        </FontIcon>
        <Dialog
          title="About"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Optimus Time is a task management helper app for Google Calendar.
          <p>Authorization from Google Calendar is required - click "Login with Google" to authorize.</p>
          <p>Enter your upcoming tasks using the form that appears, then click Submit to have Optimus Time automatically assign your tasks time slots based on your availability.</p>
          <p>Review added tasks in the calendar at the bottom of the app.</p>
          <p><b>Created by:</b> Zach Anderson, Lydia Batchelor, Jesse McKenna, Marc Tibbs</p>
        </Dialog>
      </div>
    );
  }
}