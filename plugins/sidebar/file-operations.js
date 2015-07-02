'use strict';

const React = require('react');
const { Menu, MainButton, ChildButton } = require('react-mfb-iceddev');

const { newFile, saveFile } = require('../../src/actions/file');
const { showDelete, showDownload } = require('../../src/actions/overlay');
const { enableAuto } = require('../../src/actions/device');

require('react-mfb-iceddev/mfb.css');

function download(){
  enableAuto();
  showDownload();
}

const FileOperations = React.createClass({
  render: function(){

    return (
      <Menu effect="zoomin" method="click" position="bl">
        <MainButton
          iconResting="ion-plus-round"
          iconActive="ion-close-round" />
        <ChildButton
          onClick={download}
          icon="ion-code-download"
          label="Download" />
        <ChildButton
          onClick={showDelete}
          icon="ion-backspace-outline"
          label="Delete File" />
        <ChildButton
          onClick={saveFile}
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
