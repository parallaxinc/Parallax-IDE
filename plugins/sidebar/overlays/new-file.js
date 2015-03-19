'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const styles = require('../styles');

class NewFileOverlay extends React.Component {
  constructor(){
    this.state = {
      value: ''
    };

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.updateName = this.updateName.bind(this);
  }

  updateName(evt){
    this.setState({
      value: evt.target.value
    });
  }

  clearName(){
    this.setState({
      value: ''
    });
  }

  onAccept(evt){
    this.clearName();
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(this.state.value, evt);
    }
  }

  onCancel(evt){
    this.clearName();
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  render(){
    return (
      <Card styles={styles.overlay}>
        <h3 style={styles.overlayTitle}>Please name your file.</h3>
        <TextField
          value={this.state.value}
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={this.updateName} />
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this.onAccept}>Create</Button>
          <Button onClick={this.onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }
}

module.exports = NewFileOverlay;
