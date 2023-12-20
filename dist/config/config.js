require('dotenv').config();
module.exports = {
    "local": {
        "username": process.env.LOCAL_DB_USERNAME,
        "password": process.env.LOCAL_DB_PASSWORD,
        "database": process.env.LOCAL_DB_NAME,
        "host": process.env.LOCAL_DB_HOST,
        "port": process.env.LOCAL_DB_PORT,
        "dialect": "mysql"
    },
    "development": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "dialect": "mssql",
        "logQueryParameters": false
    },
    "uat": {
        "username": process.env.UAT_DB_USERNAME,
        "password": process.env.UAT_DB_PASSWORD,
        "database": process.env.UAT_DB_NAME,
        "host": process.env.UAT_DB_HOST,
        "port": process.env.UAT_DB_PORT,
        "dialect": "mssql"
    },
    "production": {
        "username": process.env.MAIN_DB_USERNAME,
        "password": process.env.MAIN_DB_PASSWORD,
        "database": process.env.MAIN_DB_NAME,
        "host": process.env.MAIN_DB_HOST,
        "port": process.env.MAIN_DB_PORT,
        "dialect": "mssql"
    }
};
//# sourceMappingURL=config.js.map
