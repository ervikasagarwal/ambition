import express from 'express';
// import ejs from 'ejs'; installed
import { PORT } from './src/config';

const bodyParser = require('body-parser');
const path = require('path');

const router = require('./src/router');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/view'));

app.use(express.static(path.join(__dirname, 'src/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((_req, res, next) => {
  console.log('_req.header:- ', _req.headers);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', router);

app.listen(PORT, () => {
  console.info(`app listening at port ${PORT}`);
});
