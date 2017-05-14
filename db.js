//-> requiring the sequelize model
var Sequelize = require('sequelize');

/*  LESSON TIME: Environment Variables:
In node you have environment variables, these variables depend on where node is run and various
convigutations.
One of these environment variables is env.This is set in production in heroku
In heroku:

   if env_ = production -> use postgres, if not then use sqlite

  Also when you ran the add on command on heroku, you got access to another variable
  which is database_url  and stores our connection information
*/

var env = process.env.NODE_ENV || 'development';
var sequelize;
if(env === 'production'){ // --> this is only true when it's in heroku
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': "postgres",
	});
}else{
	sequelize = new Sequelize(undefined, undefined, undefined, { //-> development ode
	'dialect': "sqlite",
	'storage': __dirname + '/data/dev-todo-api.sqlite' //-> store data locally
});
}

var db = {};

/* LESSON: importing the file into sequelize, in this case the model
   
   To db, you are adding:
   		- the model,
   		- the sequelize instance that contains the configuration of where to store it
   		- Sequelize library

*/
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);


// LESSON : allows you to export the database, so that you can use it
//          in server.js
module.exports = db;