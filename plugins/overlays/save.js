'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');
const { createContainer } = require('sovereign');

const fileStore = require('../../src/stores/file');
const { clearName, updateName } = require('../../src/actions/file');

const styles = require('./styles');

class SaveOverlay extends React.Component {
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
        <h3 style={styles.overlayTitle}>Do you want to save the changes you made to New file?</h3>
        <TextField
          value={fileName}
          ref="filename"
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          tabIndex='1'
          onChange={this._onUpdateName} />
        <div style={styles.overlayButtonContainer}>
          <Button tabIndex='1' onClick={this._onAccept}>Save As</Button>
          <Button onClick={() => this._onCancel({ trash: true })}>Don't Save</Button>
          <Button onClick={() => this._onCancel({ trash: false })}>Cancel</Button>
        </div>
      </Card>
    );
  }

  _onAccept(){
    const { onAccept } = this.props;

    if(typeof onAccept === 'function'){
      onAccept();
    }
    clearName();
  }

  _onCancel(status){
    const { onCancel } = this.props;

    clearName();
    if(typeof onCancel === 'function'){
      onCancel(status);
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

module.exports = createContainer(SaveOverlay, {
  getStores(){
    return {
      fileStore: fileStore
    };
  },

  getPropsFromStores() {
    return fileStore.getState();
  }
});
