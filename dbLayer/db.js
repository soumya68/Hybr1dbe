
const mysql = require('mysql');
require('dotenv').config();
var dbConnectionInfo = {
  host:process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user:process.env.MYSQL_USER,
  password:process.env.MYSQL_PASSWORD,          
  database:process.env.MYSQL_DATABASE
};
//create mysql connection pool
var dbconnection = mysql.createPool(
  dbConnectionInfo
);

// Attempt to catch disconnects 
dbconnection.getConnection((err, connection) => {
  if(err) throw err;
 else console.log('connected to database');
})

  
module.exports= dbconnection;



