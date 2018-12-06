const mysql2 = require('mysql2/promise');
const config = require('./').SQLdb;

const readPool = mysql2.createPool(config);
console.log(config);
module.exports = {
  readPool,
};
