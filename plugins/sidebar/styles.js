'use strict';

const StyleSheet = require('react-style');

const red = '#da2100';
const green = '#159600';

const styles = {
  card: StyleSheet.create({
    margin: 0,
    height: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  overlayUserMessage: {
    display: 'flex',
    margin: '20px',
    color: '#911',
    backgroundColor: '#fcdede',
    border: '1px solid #d2b2b2',
    borderRadius: '3px',
    padding: '10px'
  },
  changeFolderButton: {
    position: 'absolute',
    top: -28,
    margin: 0,
    right: 19,
    left: 'auto',
    transform: 'none'
  },
  fileTempIndicator: {
    backgroundColor: green,
    height: 10,
    width: 10,
    borderRadius: '100%',
    marginRight: 5,
    display: 'inline-block'
  },
  fileHasTemp: {
    backgroundColor: red
  },
  errorToast: {
    backgroundColor: red
  },
  successToast: {
    backgroundColor: green
  }
};

module.exports = styles;
