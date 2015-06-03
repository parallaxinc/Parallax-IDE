'use strict';

const _ = require('lodash');
const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const FileActions = require('../../../src/actions/FileActions.js');
const FileStore = require('../../../src/stores/FileStore.js');

const { createContainer } = require('sovereign');

const styles = require('../styles');

class NewFileOverlay extends React.Component {
  constructor(){

    this._onAccept = this._onAccept.bind(this);
    this._onCancel = this._onCancel.bind(this);

  }

  render(){
    return (
      <Card styles={styles.overlay}>
        <h3 style={styles.overlayTitle}>Please name your file.</h3>
        <TextField
          value={this.props.fileName}
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={FileActions.updateName} />
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this._onAccept}>Create</Button>
          <Button onClick={this._onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }

  _onAccept(evt){
    FileActions.clearName();
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(this.props.fileName, evt);
    }
  }

  _onCancel(evt){
    FileActions.clearName();
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }
}

const NewFileOverlayContainer = createContainer(NewFileOverlay, {
  getStores(){
    return {
      FileStore: FileStore
    };
  },

  getPropsFromStores() {
    return FileStore.getState();
  }
});

module.exports = NewFileOverlayContainer;
