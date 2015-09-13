'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

class OverwriteOverlay extends React.Component {

  constructor(...args){
    super(...args);

    this.overwrite = this.overwrite.bind(this);
  }

  overwrite(){
    const {
      filename,
      handlers
    } = this.props;

    const {
      overwriteFile
    } = handlers;

    overwriteFile();
  }

  render(){
    const {
      filename,
      handlers
    } = this.props;

    const {
      hideOverlay
    } = handlers;

    return (
      <Overlay>
        <OverlayTitle>File '{filename}' already exists. Overwrite anyway?</OverlayTitle>
        <OverlayFooter>
          <Button onClick={this.overwrite}>Overwrite</Button>
          <Button onClick={hideOverlay}>Cancel</Button>
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
