'use strict';

const React = require('react');
const AppBar = require('react-material/components/AppBar');

const styles = {
  appbar: {
    normalAppBarStyle: {
      backgroundColor: '#2c83d8'
    }
  },
  logo: {
    boxSizing: 'border-box',
    height: '100%',
    position: 'absolute',
    right: 0,
    padding: 8
  }
};

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
