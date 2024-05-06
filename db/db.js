const { Sequelize } = require("sequelize");

module.exports = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {dialect : 'postgres', host : 'localhost', logging:false,
define: {
  charset: 'utf8',
  collate: 'utf8_general_ci', // Optionnel : définir le collate
}});