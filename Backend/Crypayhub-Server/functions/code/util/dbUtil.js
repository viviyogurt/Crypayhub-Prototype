const mysql = require('mysql')
const dbconnection = require('../../config/db').connection
/**
 *create connection pool
 */
const pool = mysql.createPool({
    host: dbconnection.HOST,
    user: dbconnection.USERNAME,
    password: dbconnection.PASSWORD,
    database: dbconnection.DATABASE
})
/**
 * non transaction execution
 * @param {string} sql
 * @param {obj} values
 */
const query = async function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
/**
 * open connection
 */
const getConnection=async function(){
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err)
            } else {
                resolve(connection)
            }
        })
    })
}

class DBUnity{
    /**
     * init connection
     * @param {object} connection
     */
    constructor(connection){
        this.blTransaction=false;
        this.connection=connection;
        /**
         * begin transaction
         */
        this.beginTransaction=async()=>{
            return new Promise((resolve, reject) => {
                this.connection.beginTransaction((err,success)=>{
                    if (err) {
                        this.blTransaction=false;
                        reject(err)
                    } else {
                        this.blTransaction=true;
                        resolve(success)
                    }
                })
            })
        };
        /**
         * execute sql
         * @returns {object} is class dbResult
         */
        this.query=async(sql, values)=>{
            return new Promise((resolve, reject) => {
                this.connection.query(sql, values,(err, rows)=>{
                    if(!this.blTransaction){
                        this.connection.release();
                        reject(new dbResult(0,false,"Transaction not yet open",null))
                    }
                    if (err) {
                        reject(new dbResult(0,false,JSON.stringify(err),null))
                    } else {
                        resolve(new dbResult(1,true,"success",rows))
                    }
                })
            })
        };
        /**
         * commit
         */
        this.commit=async()=>{
            return new Promise((resolve, reject) => {
                this.connection.commit((err)=>{
                    if(err){
                        this.connection.release();
                        reject(err)
                    }else{
                        this.connection.release();
                        resolve();
                        console.log("transaction committed");
                    }
                })
            })
        };
        /**
         * rollback
         */
        this.rollback=async()=>{
            this.connection.rollback(()=>{
                this.connection.release();
                console.log("transaction rollbacked");
            })
        }
    }
}

class dbResult{
    /**
     * database result
     * @param {number} return code 0:fail,1:success
     * @param {boolean} success
     * @param {string} message
     * @param {object} data obj
     */
    constructor(code,success,message,data){
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}

module.exports = {
    query,
    DBUnity,
    getConnection
}
