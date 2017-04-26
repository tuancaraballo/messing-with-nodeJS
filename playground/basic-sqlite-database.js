var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': "sqlite",
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});
// --> __diraname allows you to refer to the current directory where the
//     sqlite file if  found

/* LESSON: Why do we use Squelize ??
		   
		   Sequelize allows us to manage our data as objects an arrays
           and it will do the hard work for us to convert that to sqlite
           calls to our database. It also works across different databases
           such as MySQL,PostgresSQL, this way you can only worry about the code instead
           of worrying about the details of databases. It's very esasy to use and
           it will help you speed up your code. If you use MySql you will end up
           writing your own base of sequelize anyways
*/


var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false, // --> this allow  this field to be optional
		validate: {
			// noEmpty : true// --> this prevent users from entering empty strings
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: true // --> sets default value in case the user doesn't enter it
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
	// email: {
	// 	type: Sequelize.STRING;
	// }
	// they are both the sames
	
});


/*
	LESSON TIME: this code allows the one to many relationship where a user can have
				 many todo items. This code sets up a foreign key
*/
Todo.belongsTo(User);
User.hasMany(Todo);

/*
Lesson: creating stuff in the database and creating the database
        force:true forces to drop all the existing tables and recreate them
        when you restart the databse.
        force is false by default. Meaning that it will only created a table
       if it doesn't exist.
*/
sequelize.sync(
	// {force: true}
).then(function() {
	console.log('Everything is synced');

	User.findById(1).then( function (user) {
		user.getTodos({
			where: {completed:false}
		}).then( function (todos) { /// --> LESSON: getTodos, is the method get + className
			todos.forEach( function (todo) {     // and it will let you access to all that stuff
				console.log(todo.toJSON());
			});
		});
	});

	// User.create({
	// 	email: "tuan2606@stanford.edu"
	// }).then(function () {
	// 	return Todo.create({
	// 		description: "grind hard!"
	// 	});
	// }).then( function (todo) {
	// 	User.findById(1).then(function (user) {
	// 		user.addTodo(todo);  //-> builtin command once you have established the relationship
	// 	});
	// });
});