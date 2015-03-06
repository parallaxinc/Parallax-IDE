'use strict';

const ReactStyle = require('react-style');

const styles = {
  card: ReactStyle({
    margin: 0,
    height: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  textField: {
    containerStyling: ReactStyle({
      width: '100%'
    })
  },
  fileOperations: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto'
  },
  button: ReactStyle({
    marginTop: '10px'
  })
};

module.exports = styles;
