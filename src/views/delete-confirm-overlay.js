'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

const { deleteFile } = require('../actions/file');
const { hideDelete} = require('../actions/overlay');

class DeleteConfirmOverlay extends React.Component {
  render(){
    const {
      filename
    } = this.props;

    return (
      <Overlay>
        <OverlayTitle>Are sure you want to delete {filename}?</OverlayTitle>
        <OverlayFooter>
          <Button onClick={() => deleteFile(filename)}>Yes</Button>
          <Button onClick={() => hideDelete()}>No</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(DeleteConfirmOverlay, {
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
