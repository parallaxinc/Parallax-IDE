'use strict';

const StyleSheet = require('react-style');

const styles = {
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
  overlayLarge: StyleSheet.create({
    height: 400
  }),
  overlayTitle: {
    margin: 0
  },
  overlayDevicesBottom: {
    margin: 'auto 0 0',
    display: 'flex'
  },
  overlayButtonContainer: {
    marginLeft: 'auto',
    height: '40px'
  },
  overlayLoadingContainer: {
    height: '40px'
  },
  overlaySelectContainer: {
    display: 'flex',
    marginTop: 20
  },
  overlayUserMessage: {
    display: 'flex',
    margin: '20px',
    color: '#911',
    backgroundColor: '#fcdede',
    border: '1px solid #d2b2b2',
    borderRadius: '3px',
    padding: '10px'
  },
  progressContainerStyle: {
    width: '100%',
    height: '8px',
    backgroundColor: '#b0d0ef',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  progressBarStyle: {
    height: '100%',
    backgroundColor: '#3a81f0'
  },
  deviceTable: {
    width: '100%',
    maxWidth: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    display: 'table'
  },
  deviceTableWrapper: {
    position: 'relative'
  },
  deviceTableScroll: {
    height: '250px',
    overflow: 'auto',
    marginTop: '5px'
  },
  deviceTh: {
    padding: '8px',
    textAlign: 'left',
    borderTop: 0,
    borderBottom: '2px solid #ddd',
    verticalAlign: 'bottom',
    fontWeight: 'bold'
  },
  deviceTd: {
    display: 'table-cell',
    padding: '8px',
    borderSpacing: 'collapse',
    verticalAlign: 'top',
    borderTop: '1px solid #ddd'
  },
  active: {
    backgroundColor: '#ddd'
  },
  inactive: {
    backgroundColor: 'transparent'
  },
  progressBar: {
    height: '50px',
    width: '50px'
  },
  deleteButton: {
    border: 0,
    background: 'none',
    padding: 0,
    float: 'right',
    position: 'relative',
    zIndex: 7
  },
  buttonIcon: StyleSheet.create({
    display: 'inline-block',
    padding: 0,
    width: '30px',
    verticalAlign: 'middle',
    pointerEvents: 'none'
  }),
  projectList: StyleSheet.create({
    flex: 1,
    marginTop: 10
  })
};

module.exports = styles;
