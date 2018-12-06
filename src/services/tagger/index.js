const mysql2 = require('mysql2/promise');
const config = require('../../config').SQLdb;
const { tags } = require('./config');
const { preProcessTag } = require('./preProcess');
const { processCompany } = require('./processCompany');

const tag = async (data, resourceName = 'Company') => {
  try {
    if (!data.length) return 0;
    // const details = tags[resourceName];

    const preProcessedName = preProcessTag(data);
    // removes all special characters, but it doesn't removes ('.',' ')

    if (!preProcessedName.length) return 0;

    if (resourceName === 'Company') {
      let processedCompanyName = processCompany(preProcessedName);
      // removing suffixs eg :- domain name, types, locations

      processedCompanyName = processedCompanyName.replace(/[ .]/g, '');
      processedCompanyName = processedCompanyName.trim();
      
      // console.log('type of ', typeof processedCompanyName, 'processedCompanyName', processedCompanyName);
      let connection = await mysql2.createConnection(config);
      const matchesQuery = `SELECT CompanyId,ShortName,Name,ProcessedCompName,UrlName FROM companies 
                            WHERE ProcessedCompName LIKE '${processedCompanyName}'
                            OR Name LIKE '${processedCompanyName}' 
                            OR ShortName LIKE  '${processedCompanyName}'
                            OR UrlName LIKE '${processedCompanyName}'
                            OR ShortName LIKE '${preProcessedName}'`;


      const [matches] = await connection.execute(matchesQuery);
      connection.end();

      if (matches.length === 1) {
        console.log(matches[0].CompanyId);
        return matches[0].CompanyId;
      }
      if (matches.length > 1) {
        const priorityList = ['ProcessedCompName', 'Name', 'ShortName', 'UrlName', ];
        priorityList.forEach((columnName) => {
          matches.forEach((match) => {
            if (match[columnName].toLowerCase === processedCompanyName) {
              console.info('PRIORITY ', match.CompanyId);
              return match.CompanyId;
            }
          });
        });
      }

      connection = await mysql2.createConnection(config);
      const [matchedTags] = await connection.execute(`SELECT Id FROM similar_data 
                                             WHERE Name LIKE  '${preProcessedName}'
                                             OR ProcessedName LIKE '${processedCompanyName}' `);
      console.log('matchedTags', matchedTags);
      connection.end();

      if (matchedTags.length !== 0) {
        return matchedTags[0].Id;
      }
      return 0;
    }
  } catch (error) {
    console.info(error);
    throw error;
  }
};
module.exports = {
  tag,
};
// tag('      ///\\\$*$#,:=-;/amazon.com india pvt ltd     ', 'Company');
