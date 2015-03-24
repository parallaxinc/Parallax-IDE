'use strict';

const React = require('react');
const AppBar = require('react-material/components/AppBar');

const styles = require('./styles');

class TopBar extends React.Component {

  render(){
    return (
      <AppBar styles={styles.appbar}>
        <img src="/assets/logo.png" style={styles.logo} />
      </AppBar>
    );
  }
}

module.exports = TopBar;
