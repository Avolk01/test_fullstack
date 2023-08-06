const {Client} = require('pg');
const client = new Client({
    user: "postgres",
    password: "asdsa12345",
    host: "localhost",
    port: 5432,
    database: "test"
});
client.connect();
console.log('database connected');
module.exports = client;