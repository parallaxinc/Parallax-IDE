'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

const styles = {
  textField: {
    containerStyling: {
      width: '100%'
    }
  }
};

class SaveOverlay extends React.Component {

  constructor(...args){
    super(...args);

    const { defaultFilename } = this.props;

    this.state = {
      filename: defaultFilename,
      typing: false
    };

    this.save = this.save.bind(this);
    this.dontSave = this.dontSave.bind(this);
    this.cancel = this.cancel.bind(this);
    this.updateName = this.updateName.bind(this);
  }

  componentDidMount() {
    this.focusInput();
  }

  componentDidUpdate() {
    this.focusInput();
  }

  componentWillReceiveProps(nextProps){
    const { typing } = this.state;

    if(!typing){
      this.setState({ filename: nextProps.defaultFilename });
    }
  }

  save(){
    const { filename } = this.state;

    const {
      saveFileAs,
      hideOverlay
    } = this.props.handlers;

    saveFileAs(filename);
    this.clearName();
  }

  dontSave(){
    const {
      hideOverlay,
      dontSaveFile
    } = this.props.handlers;

    dontSaveFile();
    hideOverlay();
    this.clearName();
  }

  cancel(){
    const { hideOverlay } = this.props.handlers;

    hideOverlay();
    this.clearName();
  }

  updateName(evt){
    const { value } = evt.target;

    this.setState({
      filename: value,
      typing: true
    });
  }

  clearName(){
    this.setState({
      filename: '',
      typing: false
    });
  }

  focusInput() {
    React.findDOMNode(this.refs.filename).getElementsByTagName('input')[0].focus();
  }

  render(){
    const { isNew } = this.props;
    const { filename } = this.state;

    let dontSaveButton;
    if(isNew && this.props.showDontSaveButton){
      dontSaveButton = (
        <Button onClick={this.dontSave}>Don't Save</Button>
      );
    }

    return (
      <Overlay>
        <OverlayTitle>Do you want to save the changes you made to this file?</OverlayTitle>
        <TextField
          value={filename}
          ref="filename"
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={this.updateName} />
        <OverlayFooter>
          <Button onClick={this.save}>Save As</Button>
          {dontSaveButton}
          <Button onClick={this.cancel}>Cancel</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(SaveOverlay, {
  getStores({ workspace }){
    return {
      workspace
    };
  },

  getPropsFromStores({ workspace }){
    const {
      isNew,
      filename
    } = workspace.getState();

    return {
      isNew,
      defaultFilename: filename
    };
  }
});
