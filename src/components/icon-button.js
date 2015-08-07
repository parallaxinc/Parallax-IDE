'use strict';

const React = require('react');
const Icon = require('react-material/components/Icon');

const styles = {
  deleteButton: {
    border: 0,
    background: 'none',
    padding: 0,
    float: 'right',
    position: 'relative',
    zIndex: 7
  },
  buttonIcon: {
    display: 'inline-block',
    padding: 0,
    width: '30px',
    verticalAlign: 'middle',
    pointerEvents: 'none'
  }
};

class IconButton extends React.Component {
  render(){
    const {
      onClick,
      icon
    } = this.props;

    return (
      <button style={styles.deleteButton} onClick={onClick}>
        <Icon icon={icon} styles={styles.buttonIcon} />
      </button>
    );
  }
}

module.exports = IconButton;
