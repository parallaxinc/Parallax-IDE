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
  fileOperations: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto'
  },
  button: StyleSheet.create({
    marginTop: '10px'
  })
};

module.exports = styles;
