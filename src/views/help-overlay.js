'use strict';

const React = require('react');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

const helpStyle = {
  position: 'relative',
  marginTop: '25px'
};

const helpLink = 'http://www.parallax.com/go/PBASICHelp';

class HelpOverlay extends React.Component {


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

module.exports = HelpOverlay;
