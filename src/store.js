'use strict';

const createStore = require('redux-create-store');

const reducers = require('./reducers');

const store = createStore(reducers);

module.exports = store;
