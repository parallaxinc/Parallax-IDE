'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

class DeleteProjectOverlay extends React.Component {
  render(){
    const {
      name,
      handlers
    } = this.props;

    const {
      deleteProject,
      showProjectsOverlay
    } = handlers;

    return (
      <Overlay>
        <OverlayTitle>Are you sure you want to delete {name}?</OverlayTitle>
        <OverlayFooter>
          <Button onClick={() => deleteProject(name)}>Yes</Button>
          <Button onClick={showProjectsOverlay}>No</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(DeleteProjectOverlay, {
  getStores({ store }){
    return {
      store
    };
  },

  getPropsFromStores({ store }){
    const { deleteProjectName } = store.getState();

    return {
      name: deleteProjectName
    };
  }
});
