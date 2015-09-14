'use strict';

const React = require('react');
const Button = require('react-material/components/Button');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');

const contentStyle = {
  position: 'relative'
};

const releaseNotesLink = 'https://github.com/parallaxinc/Parallax-IDE/releases';
const installationNotesLink = 'https://www.parallax.com/downloads/parallax-ide-chrome';

class NewVersionOverlay extends React.Component {

  render(){

    const {
      handlers
    } = this.props;

    const {
      hideOverlay
    } = handlers;

    const {
      name,
      version
    } = chrome.runtime.getManifest();

    return (
      <Overlay>
        <OverlayTitle>{name} Automatically Updated to v{version}</OverlayTitle>
        <div style={contentStyle}>
          You are now running a new release of {name}!
        </div>
        <div style={contentStyle}>
          See <a href={releaseNotesLink} target="_blank">Release Notes</a> and <a href={installationNotesLink} target="_blank">Installation Notes</a> for more details.
        </div>
        <OverlayFooter>
          <Button onClick={hideOverlay}>OK</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = NewVersionOverlay;
