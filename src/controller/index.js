const mysql2 = require('mysql2/promise');

const config = require('../config/index').SQLdb;
const { tag } = require('../services/tagger');

const getCompaniesInfo = async (companyIds) => {
  try {
    const companyIdsString = Object.values(companyIds).join(',');

    const connection = await mysql2.createConnection(config);
    const query = `SELECT companies.CompanyId AS CompanyId, seo_stats.CompanyReviewsLive AS reviews,  companies.UrlName AS UrlName,companies.Rating AS rating
                   FROM seo_stats,companies
                   WHERE companies.CompanyId = seo_stats.CompanyId
                   AND companies.CompanyId IN (${companyIdsString})`;

    const [resultSet] = await connection.execute(query);
    connection.end();
    resultSet.forEach((company) => {
      if (company.rating !== null) {
        const companyName = Object.keys(companyIds).find(key => companyIds[key] === company.CompanyId);
        company.id = companyName;
        delete company.CompanyId;
      }
    });
    console.log(resultSet);
    return resultSet;
  } catch (err) {
    console.error(`Error thrown by getCompaniesInfo() metod at Controllers  ${err}`);
    throw new Error(err);
  }
};
// getCompaniesInfo(['hdfc-bank', 'exl-service']);

const getCompanyProfiles = async (companiesProfileArray) => {
  try {
    const jobProfileDetails = {};
    console.log(companiesProfileArray);
    const connection = await mysql2.createConnection(config);
    companiesProfileArray.forEach((query) => {
      const queryArray = query.split('_');
      const companyName = queryArray[0];
      const profile = queryArray[1];
      // jobProfileDetails[resultSet.companyName] = resultSet;
    });
    const query = `SELECT companies.CompanyId AS CompanyId, companies.CompanyName AS CompanyName, 
                          cs.Average
                   From  companies,job_profiles,company_reviews,company_salaries 
                   INNER JOIN ( SELECT CompanyId, CompanyName FROM where UrlName = ${companyName}) c
                   ON c.CompanyId = cs.CompanyId
                   INNER JOIN (SELECT CompanyId, JobProfileName,)`;
    const [resultSet] = await connection.execute(query);
    console.log(resultSet);
  } catch (err) {
    console.error(`Error thrown by getCompanyProfiles() metod at Controllers  ${err}`);
    throw new Error(err);
  }
};

const getCompanyIds = async (companyNames) => {
  const companyIds = {};
  companyNames.forEach((companyName) => {
    companyIds[companyName] = tag(companyName, 'Company');
  });
  const companyIdsArray = await Promise.all(Object.values(companyIds));
  let i = 0;
  for (const id in companyIds) {
    companyIds[id] = companyIdsArray[i];
    i++;
  }
  return companyIds;
};
module.exports = {
  getCompaniesInfo,
  getCompanyProfiles,
  getCompanyIds,
};
