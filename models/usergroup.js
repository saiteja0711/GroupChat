const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const userGroups = sequelize.define('usergroups',{
  id: {
    type : Sequelize.INTEGER,
    autoIncrement: true,
    allowNull : false,
    primaryKey : true
  },
  isAdmin: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
     defaultValue: false
     }
  

});

module.exports = userGroups;