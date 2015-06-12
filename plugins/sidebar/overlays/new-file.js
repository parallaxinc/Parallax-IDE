'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');
const { createContainer } = require('sovereign');

const fileStore = require('../../../src/stores/file');
const { clearName, updateName } = require('../../../src/actions/file');

const styles = require('../styles');

class NewFileOverlay extends React.Component {
  constructor(){

    this._onAccept = this._onAccept.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onUpdateName = this._onUpdateName.bind(this);

  }

  componentDidMount() {
    this._setFocus();
  }

  componentDidUpdate() {
    this._setFocus();
  }

  render(){
    const { fileName } = this.props;

    return (
      <Card styles={styles.overlay}>
        <h3 style={styles.overlayTitle}>Please name your file.</h3>
        <TextField
          value={fileName}
          ref="filename"
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={this._onUpdateName} />
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this._onAccept}>Create</Button>
          <Button onClick={this._onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }

  _onAccept(evt){
    const { onAccept, fileName } = this.props;

    clearName();
    if(typeof onAccept === 'function'){
      onAccept(fileName, evt);
    }
  }

  _onCancel(evt){
    const { onCancel } = this.props;

    clearName();
    if(typeof onCancel === 'function'){
      onCancel(evt);
    }
  }

  _onUpdateName(evt){
    const { value } = evt.target;

    updateName(value);
  }

  _setFocus() {
    React.findDOMNode(this.refs.filename).getElementsByTagName('input')[0].focus();
  }
}

module.exports = createContainer(NewFileOverlay, {
  getStores(){
    return {
      fileStore: fileStore
    };
  },

  getPropsFromStores() {
    return fileStore.getState();
  }
});
