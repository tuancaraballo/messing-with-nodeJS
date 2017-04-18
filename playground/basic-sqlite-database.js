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
		allowNull: false,  // --> this allow  this field to be optional
		validate: { 
			// noEmpty : true// --> this prevent users from entering empty strings
			len: [1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: true // --> sets default value in case the user doesn't enter it
	}
});

//Lesson: creating stuff in the database and creating the database
//        force:true forces to drop all the existing tables and recreate them
//        when you restart the databse.
//        force is false by default. Meaning that it will only created a table
//        if it doesn't exist.

sequelize.sync(
		//{force: true}
	).then(function () {
	console.log('Everything is synced');

	//var todos = 

/*LESSON: everyime you add a findAll, you process it in a .then call, since all
		  all these function calls are promises
*/


	Todo.findById(2).then( function (todo) {
		if(todo){
			console.log(todo.toJSON());
		}else
			console.log('todo not found');
	});

	Todo.findAll( {
		where : {
			description: {
				$like: '%Grind%'
			}
		}
	}).then(function (todos) {
		todos.forEach(function (todo) {
			if(todo){
				console.log(todo.toJSON());
			}else{
				console.log('todo not found');
			}
			
		 });				
	});

	
/*
	Todo.create( {
		description: 'Grind hard',
		completed: false
	}).then( function (todo) {
		console.log('Finished!');
		console.log(todo);
		return Todo.create ( {
			description: 'Clean office'
		});
	}).then( function () {
		//return Todo.findById(1);
		return Todo.findAll( {
			where: {
				completed:false,  //--> where completed is false
				description: { // --> and description contains the word hard
					// --> $like allows you to find a word
					$like: '%hard%'  //--> % sign to both sides means that it
				}                   // can be in the middle
			}
		});
	}).then( function (todos) {
		if(todos){
			todos.forEach( function (todo) {
				console.log(todo.toJSON());
			});
			
		}else{
			console.log('no todo found');
		}
	}).catch (function (error) {
		console.log(error);
	});
	*/
});


