// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// don't forget to npm install dotenv, and include .env in .gitignore
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;