const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Messages = sequelize.define('messages',{
  id: {
    type : Sequelize.INTEGER,
    autoIncrement: true,
    allowNull : false,
    primaryKey : true
  },

 message : Sequelize.STRING,

 filetype : {
  type: Sequelize.STRING,
  defaultValue: 'none'
}

});

module.exports = Messages;