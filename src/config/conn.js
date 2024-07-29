import mysql2 from "mysql2";
import 'dotenv/config';

const conn = mysql2.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

conn.query('SELECT 1+1 AS solution', (err, result, fields) => {
    if (err) {
        console.log('Error:', err);
        return;
    }
    console.log('The solution is: ', result[0].solution);
});

export default conn;
