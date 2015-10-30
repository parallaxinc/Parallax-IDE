'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');
const history = require('../lib/history');

class OverwriteOverlay extends React.Component {

  render(){
    const {
      filename,
      handlers
    } = this.props;

    const {
      overwriteFile,
      cancelOverwriteFile
    } = handlers;

    return (
      <Overlay>
        <OverlayTitle>File '{filename}' already exists. Overwrite anyway?</OverlayTitle>
        <OverlayFooter>
          <Button onClick={overwriteFile}>Overwrite</Button>
          <Button onClick={cancelOverwriteFile}>Cancel</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(OverwriteOverlay, {
  getStores({ store }){
    return {
      store
    };
  },

  getPropsFromStores({ store }){
    const { nextFile } = store.getState();

    return {
      filename: nextFile
    };
  }
});
