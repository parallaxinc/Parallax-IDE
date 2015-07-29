'use strict';

const React = require('react');
const { MainButton } = require('react-mfb-iceddev');

const styles = {
  changeFolderButton: {
    position: 'absolute',
    top: -28,
    margin: 0,
    right: 19,
    left: 'auto',
    transform: 'none'
  }
};

class ProjectsButton extends React.Component {
  render(){
    const {
      onClick
    } = this.props;

    return (
      <div className="mfb-component--tl" data-mfb-toggle="hover" style={styles.changeFolderButton}>
        <MainButton
          iconResting="ion-folder"
          iconActive="ion-folder"
          label="Change Project"
          onToggleMenu={onClick} />
      </div>
    );
  }
}

module.exports = ProjectsButton;
