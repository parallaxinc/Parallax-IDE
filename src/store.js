'use strict';

const createStore = require('@phated/redux-create-store');

const reducers = require('./reducers');

const store = createStore(reducers);

module.exports = store;
