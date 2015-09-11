'use strict';

const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

const helpStyle = {
  position: 'relative'
};

const helpLink = 'http://www.parallax.com/go/PBASICHelp';

class HelpOverlay extends React.Component {

  constructor(...args){
    super(...args);
  }

  render(){
    const {
      handlers
    } = this.props;

    const {
      hideOverlay
    } = handlers;

    return (
      <Overlay>
        <OverlayTitle>Help</OverlayTitle>
        <div style={helpStyle}>
          For help with PBASIC go here: <a href={helpLink} target="_blank">{helpLink}</a>
        </div>
        <OverlayFooter>
          <Button onClick={hideOverlay}>OK</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(HelpOverlay, {
  getStores({ workspace }){
    return {
      workspace
    };
  },

  getPropsFromStores({ workspace }){
    const { cwd, projects } = workspace.getState();

    return {
      cwd,
      projects
    };
  }
});
