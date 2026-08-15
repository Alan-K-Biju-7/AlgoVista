'use strict';

const { initializeRuntime, requestHandler } = require('../server');

module.exports = async function handler(req, res) {
  await initializeRuntime();
  return requestHandler(req, res);
};
