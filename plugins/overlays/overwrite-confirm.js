'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');

const styles = require('./styles');

class OverwriteConfirmOverlay extends React.Component {
  constructor(){
    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onAccept(){
    const overwrite = true;
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(this.props.name, overwrite);
    }
  }

  onCancel(){
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel();
    }
  }

  render(){
    const filename = this.props.name;
    return (
      <Card styles={styles.overlay}>
        <h3 style={styles.overlayTitle}>File {filename} already exists. Overwrite anyway?</h3>
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this.onAccept}>Overwrite</Button>
          <Button onClick={this.onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }
}

module.exports = OverwriteConfirmOverlay;
