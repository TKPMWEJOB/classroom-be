const Sequelize = require("sequelize");

const db_config = {
    host: process.env.DB_URI,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql'
};

const db = new Sequelize(db_config.database, db_config.user, db_config.password, {
    host: db_config.host,
    dialect: db_config.dialect,
    operatorsAliases: 0
})

module.exports = db;