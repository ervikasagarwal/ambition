import express from 'express';

const router = express.Router();
const controller = require('../controller/index');
const keyHandler = require('../services/keyHandler');

// http://localhost:6789/companies?companyName=hdfc bank&companyName=exl service
router.get('/companies', async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) return res.sendStatus(401);
    const isKeyValid = keyHandler.verifyKey(token);
    if (isKeyValid) {
      let companiesNameList = req.query.companyName;
      if (!Array.isArray(companiesNameList)) {
        companiesNameList = [req.query.companyName];
      }
      const companyIds = await controller.getCompanyIds(companiesNameList);
      const resultSet = await controller.getCompaniesInfo(companyIds);
      res.json(resultSet);
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.error(`error at /user ${err}`);
    res.send('internal server error');
  }
});
router.get('/jobProfiles', async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) return res.send('invalid token');
    const isKeyValid = keyHandler.verifyKey(token);
    if (isKeyValid) {
      let profileQueries = req.query.profile;
      if (!Array.isArray(profileQueries)) {
        profileQueries = [req.query.profile];
      }
      const resultSet = await controller.getCompanyProfiles(profileQueries);
      console.timeEnd('/jobProfiles');
      res.json(resultSet);
    } else {
      return res.send('invalid key');
    }
  } catch (err) {
    console.error(`error at /user     ${err}`);
    res.send('internal server error');
  }
});
router.get('/key', async (req, res) => {
  res.render('generateKeyPage');
});
router.post('/generateKey', async (req, res) => {
  if (!req.body) return res.sendStatus(401);
  const key = keyHandler.generateKey(req.body);
  res.render('newGeneratedkey', { key });
});
module.exports = router;


// http://localhost:6789/companies?companyName=tata%20consultancy&companyName=wipro%20india%20pvt%20limited&companyName=tcs.com&companyName=360Networks Inc.&companyName=HCL Technologies&companyName=Yes Bank&companyName=Andhra Bank&companyName=Cadila Healthcare&companyName=Motilal Oswal Financial Services&companyName=Natco Pharma&companyName=Symphony&companyName=TVS Motor Company&companyName=Motherson Sumi Systems&companyName=8K Miles Software Services&companyName=Vakrangee&companyName=Torrent Pharmaceuticals&companyName=Piramal Enterprises&companyName=MRF&companyName=LIC Housing Finance&companyName=Indiabulls Housing Finance&companyName=IIFL Holdings&companyName=Bharat Financial Inclusion&companyName=Bajaj Finance&companyName=Emami&companyName=Asian Paints&companyName=Ajanta Pharma&companyName=Indian Bank
