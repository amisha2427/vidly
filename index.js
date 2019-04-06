const winston = require('winston');
const config = require('config'); 
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

/*if(!config.get('jwtPrivateKey'))
{
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}*/
console.log(config.get('jwtPrivateKey'));



const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;