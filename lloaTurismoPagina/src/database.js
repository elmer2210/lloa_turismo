const {promisify} = require('util')
const mysql = require('mysql');

//Connection with the dataBase
const {database} = require('./keys');
 
const pool = mysql.createPool(database)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTIONS WAS CLOSED')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATAVASE HAS TO MANY CONNECTIONS')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONECCTION WAS REFUSED')
        }
    }

    if (connection) connection.release();
    console.log('DATA BASE IS CONECTED NOW!!')
    return;
})

//Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;