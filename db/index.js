const mysql = require('mysql');
const db_config = require('../config/db_config');

class Db {
  constructor(db_config) {
    this.db_config = db_config;
    this.con = {};
  }

  async handleDisconnect() {
    this.con = mysql.createConnection(this.db_config);

    this.con.connect((err) => {
      if(err) {
        console.log('error when connecting to db: ', err);
        setTimeout(this.handleDisconnect.bind(this), 2000);
      }
    })

    this.con.on('error', (err) => {
      console.log('db error', err);
      if(err.code == 'PROTOCOL_CONNECTION_LOST')
      {
        this.handleDisconnect();
      } else {
        throw err;
      }
    })
  }

  async query(query, parameters) { return new Promise((resolve, reject) => {
    this.con.query(query, parameters, function(err, rows) {
      if(err)
      {
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })}
}

const db = new Db(db_config);
db.handleDisconnect();

module.exports = db;
