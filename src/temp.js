const mysql2 = require('mysql2/promise');

const config = require('../src/config').SQLdb;

const temp = async () => {
  try {
    const connection = await mysql2.createConnection(config);
    const query = 'select Name from companies  limit 200 ';


    const [resultSet] = await connection.execute(query);
    console.info(resultSet);
    let paramString = '';

    resultSet.forEach((element) => {
      console.log(element.Name);
      paramString = `${paramString}companyName=${element.Name}&`;
    });
    connection.end();
    console.log(`paramString ${paramString}`);
  } catch (err) {
    console.info(err);
  }
};
temp();
