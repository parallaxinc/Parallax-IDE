'use strict';

const React = require('react');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

const { saveFileAs } = require('../../src/actions/file');
const { hideSave } = require('../../src/actions/overlay');

const styles = {
  textField: {
    containerStyling: {
      width: '100%'
    }
  }
};

class SaveOverlay extends React.Component {

  componentDidMount() {
    this.focusInput();
  }

  componentDidUpdate() {
    this.focusInput();
  }

  focusInput() {
    React.findDOMNode(this.refs.filename).getElementsByTagName('input')[0].focus();
  }

  render(){
    const filename = '';

    return (
      <Overlay>
        <OverlayTitle>Do you want to save the changes you made to this file?</OverlayTitle>
        <TextField
          value={filename}
          ref="filename"
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={this._onUpdateName} />
        <OverlayFooter>
          <Button onClick={saveFileAs}>Save As</Button>
          <Button onClick={() => hideSave({ trash: true })}>Don't Save</Button>
          <Button onClick={() => hideSave({ trash: false })}>Cancel</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = SaveOverlay;
