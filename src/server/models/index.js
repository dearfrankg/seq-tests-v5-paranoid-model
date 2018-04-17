/* eslint no-console: 0 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const db = {};

const MISSING_CONNECTION_STRING = `
*************************************
Missing Database Connection String
Exiting program.
*************************************
`;

const INVALID_TEST_DATABASE = `
*************************************
Invalid Test Database
Use localhost for testing
Use database name pb_test_db
Exiting program.
*************************************
`;

let sequelize;
if (config.use_env_variable) {
  const DATABASE_URL = process.env[config.use_env_variable];

  if (typeof DATABASE_URL !== "string") {
    console.error(MISSING_CONNECTION_STRING);
    process.exit();
  }

  if (process.env.SHOW_DB_URL) {
    console.log("DATABASE_URL: ", DATABASE_URL.substr(DATABASE_URL.indexOf("@") + 1));
  }

  const isInvalidTestHost = env === "test" && !/(@localhost:|@127\.0\.0\.1:)/.test(DATABASE_URL);
  const isInvalidTestDB = env === "test" && !/pb_test_db$/.test(DATABASE_URL);
  if (isInvalidTestHost || isInvalidTestDB) {
    console.error(INVALID_TEST_DATABASE);
    process.exit();
  }

  sequelize = new Sequelize(DATABASE_URL, {
    logging: false,
    operatorsAliases: false,
    define: {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    const LAST_THREE_CHARS = 3;
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-LAST_THREE_CHARS) === ".js";
  })
  .forEach(file => {
    // eslint-disable-next-line
    const model = sequelize["import"](path.join(__dirname, file));

    console.log("model: ", model.name);
    db[model.name] = model;
  });

// handle associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// handle scopes
Object.keys(db).forEach(modelName => {
  if (db[modelName].loadScopes) {
    db[modelName].loadScopes(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// activate autocommit
db.sequelize.hook("afterConnect", connection => {
  connection.query("SET SESSION autocommit = 1");
});

module.exports = db;
