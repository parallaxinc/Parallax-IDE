'use strict';

const React = require('react');
const Icon = require('react-material/components/Icon');

const styles = require('./styles');

const IconButton = React.createClass({
  onClick: function(){
    if(this.props.onClick){
      this.props.onClick.apply(this, arguments);
    }
  },
  render: function(){
    return (
      <button style={styles.deleteButton} onClick={this.onClick}>
        <Icon icon={this.props.icon} styles={styles.buttonIcon} />
      </button>
    );
  }
});

module.exports = IconButton;
