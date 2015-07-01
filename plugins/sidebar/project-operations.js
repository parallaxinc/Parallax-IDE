'use strict';

const React = require('react');
const { MainButton } = require('react-mfb-iceddev');

const { showProjects } = require('../../src/actions/overlay');

const styles = require('./styles');

class ProjectOperations extends React.Component {

  render(){
    return (
      <div className="mfb-component--tl" data-mfb-toggle="hover" style={styles.changeFolderButton}>
        <MainButton
          iconResting="ion-folder"
          iconActive="ion-folder"
          label="Change Project"
          onToggleMenu={showProjects} />
      </div>
    );
  }
}

module.exports = ProjectOperations;
