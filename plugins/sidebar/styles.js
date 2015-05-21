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
  overlayButtonContainer: {
    margin: 'auto 0 0 auto'
  },
  overlaySelectContainer: {
    display: 'flex',
    marginTop: 20
  },
  overlayTableContainer: {
  },
  deviceTable: {
    width: '100%',
    maxWidth: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    display: 'table',

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
  changeFolderButton: {
    position: 'absolute',
    top: -28,
    margin: 0,
    right: 19,
    left: 'auto',
    transform: 'none'
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
  }),
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
