'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('../component/button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

class DeleteFileOverlay extends React.Component {

  constructor(...args){
    super(...args);

    this.delete = this.delete.bind(this);
  }

  delete(){
    const {
      filename,
      handlers
    } = this.props;

    const {
      deleteFile,
      hideOverlay
    } = handlers;

    deleteFile(filename);
    hideOverlay();
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
        <OverlayTitle>Are you sure you want to delete {filename}?</OverlayTitle>
        <OverlayFooter>
          <Button onClick={this.delete}>Yes</Button>
          <Button onClick={hideOverlay}>No</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(DeleteFileOverlay, {
  getStores({ workspace }){
    return {
      workspace
    };
  },

  getPropsFromStores({ workspace }){
    const { filename } = workspace.getState();

    return {
      filename
    };
  }
});
