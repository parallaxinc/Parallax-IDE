'use strict';

const React = require('react');
const { Menu, MainButton, ChildButton } = require('react-mfb-iceddev');
const { newFile, processSave, showDelete } = require('../../src/actions/file');
const { showDownload } = require('../../src/actions/device');

require('react-mfb-iceddev/mfb.css');

const FileOperations = React.createClass({
  render: function(){

    return (
      <Menu effect="zoomin" method="click" position="bl">
        <MainButton
          iconResting="ion-plus-round"
          iconActive="ion-close-round" />
        <ChildButton
          onClick={showDownload}
          icon="ion-code-download"
          label="Download" />
        <ChildButton
          onClick={showDelete}
          icon="ion-backspace-outline"
          label="Delete File" />
        <ChildButton
          onClick={processSave}
          icon="ion-compose"
          label="Save File" />
        <ChildButton
          onClick={newFile}
          icon="ion-document"
          label="New File" />
      </Menu>
    );
  }
});

module.exports = FileOperations;
