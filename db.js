//-> requiring the sequelize model
var Sequelize = require('sequelize');

//-> instantiating the sequelize model wit the right configuration.
//   of the type and where you are storing it. 
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': "sqlite",
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});


var db = {};

/* LESSON: importing the file into sequelize, in this case the model
   
   To db, you are adding:
   		- the model,
   		- the sequelize instance that contains the configuration of where to store it
   		- Sequelize library

*/
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// LESSON : allows you to export the database, so that you can use it
//          in server.js
module.exports = db;