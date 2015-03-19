'use strict';

const StyleSheet = require('react-style');

const styles = {
  card: StyleSheet.create({
    margin: 0,
    height: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  textField: {
    containerStyling: StyleSheet.create({
      width: '100%'
    })
  },
  overlay: StyleSheet.create({
    width: 400,
    height: 200,
    margin: '100px auto 0',
    display: 'flex',
    flexDirection: 'column'
  }),
  overlayTitle: {
    margin: 0
  },
  overlayButtonContainer: {
    margin: 'auto 0 0 auto'
  }
};

module.exports = styles;
