const Sequelize = require('sequelize').Sequelize;

/** CHANGE USERNAME AND PASSWORD */
const sequelize = new Sequelize('node-complete', 'max', 'secret', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;
