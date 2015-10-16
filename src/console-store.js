'use strict';

/*
  The terminal console is causing too many renders on components
  throughout the application.  We could implement finer-grained
  subscribes through lenses but for now, just create a new store.
 */

const createStore = require('@phated/redux-create-store');

const reducers = {
  echo: require('./reducers/echo'),
  rxtx: require('./reducers/rxtx')
};

const consoleStore = createStore(reducers);

module.exports = consoleStore;
