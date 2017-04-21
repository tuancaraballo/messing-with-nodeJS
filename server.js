var express = require('express');
var bodyParser = require('body-parser');

/*
	LESSON TIME: underscore

		-> this is a library that has many functions that you don't have to build yourself.
			example of these functions include: where, that allows you to find items into a list

			where : returns everything that matches
			findWhere: returns just the first match

			visit underscorejs.org

*/

var _ = require('underscore');
var db = require('./db.js'); //-> importing the database

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;


//--> This is a middleware, remember that when you use
// app.use all methods will call this first.


app.use(bodyParser.json()); //--> it allows to parse JSON objects sent on the
// on the request body.
// Every time a JSON comes in, express will parse it
// and access it via request.body;


app.get('/', function(request, response) {
	response.send('Root API');
});

app.get('/todos', function(request, response) {
	var queryParams = request.query;
	var whereObject = {};


	var filtedTodos = todos;

	// LESSON TIME: notice how the query parameter here instead of a boolean
	//              it's a string
	if (queryParams.hasOwnProperty('completed') && queryParams['completed'] === 'true') {
		whereObject.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams['completed'] === 'false') {
		whereObject.completed = false;
	}

	// LESSON TIME: Check if the queue property exists in the queryParam
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		whereObject.description = {
				$like: '%'+queryParams.q.toLowerCase() + '%'
		};
	}

	db.todo.findAll( {
		where:whereObject
	}).then(function (todos) {
		if(!!todos){
			response.status(200).json(todos);	
		}else{
			response.status(404).send();
		}					
	}, function (error){ 
		response.status(500).send();
	});
});



// --> The class had the index.html inside a public directory 
//     so you might do  __dirname +'/public'
//app.use(express.static(__dirname));


/**	LESSON TIME:  == vs === and converting a request.param into the 
				  datatype you want.

	For example, in this function:
	 		todo[i].id == id   --> this worked!
	 		todo[i].id === id  --> didn't work because it checked for type

	 			and the reason why is becasue I initially didn't parseInt the 
	 			parameters so the data stored in the list was different
	 	Solution:
	 		
	 		var id = parseInt(rquest.params.id, 10);  --> base 10						  


**/

/** LESSON TIME:   Accessing argumens from url and sending error statuses 
	1- Express uses the colon : to parse the data, so that you can use it 
	2- You can access this data through the request:
			request.params.id  (no need to use colon)  
	3- You can pass as many parameters as you want in the urls.
	4- Send an error status if you can't find a result
		response.status(404).send('Not found');
	5- !! -> used for objects or stuff that are not bolean, you look at the 
		truthy version of them.  !! -> same as true
 **/

app.get('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);
	
	db.todo.findById(todoId).then( function (todo) {
		if(!!todo){
			response.status(200).json(todo.toJSON());
		}else{
			response.status(404).send();
		}
		
	}, function (error) {  //--> remember this is the same as using a catch
		response.status(500).send();
		//-->status 500 means it's an issue with the server, not with the client
		// request 
	});
});

/**
	LESSON TIME: POST/todos and body parser, send JSON data in the body
				 to server using POSTMAN

 --> Bodyparser allows you to parse a JSON object when it comes 
 	 in the request.

	1- npm install body-parser --save  #--> remember that the --save saves it into
									the package.json, which allows
									you to just run npm install without any
									extra argumens if lose the node_modules

    2- var bodyParse = require('body-parser');

	3- Add at the beginnig:

				app.use(bodyParser.json())

    3- To send data to your server using POSTMAN, you first need to
        change the method to POST, then go to the body tab, from the dropdown
        menu right next to binary, which might show 'text' by default, pick 
        JSON(application/json). Notice how Headers(1) shows 1 now
**/
app.post('/todos', function(request, response) {
	//var body = request.body;

	// --> this method from underscore, allows to filted the information
	//    that we need from the request. 
	var body = _.pick(request.body, 'description', 'completed');

	// LESSON: Although sequelize will do its own validation, it's safe to add another exra layer of validation
	//  although Andrew said not to do it, but I just came acrossanissue here
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		console.log('Did not work!');
		return response.status(400).send("Wrong argument types");
	}

	body.description = body.description.trim();
	body.id = todoNextId;

	db.todo.create(body).then( function (todo) {
		response.status(200).json(todo.toJSON());
	}).catch(function (error){
		return response.status(400).json(error);
	});
	todoNextId++;
});


// DELETE from Array
app.delete('/todos/:id', function(request, response) {

	var todoId = parseInt(request.params.id, 10);
	var whereObject= {};
	whereObject.id = todoId;
	
	db.todo.destroy({
		where:whereObject
	}).then( function (rowsDeleted){
		if(rowsDeleted === 0){
			response.status(200).send("Error");
		}else{
			response.status(204).send("Success"); //--> status 204, everything went well, nothing to send back
		}
		
	}, function() {
		response.status(500).send('Not found');
	});
});


// PUT to update the array

app.put('/todos/:id', function (request, response) {
	// -> filter the request to give you only these two fields
	var body = _.pick(request.body, 'description', 'completed');
	// -> get the id from the url 

	var todoId = parseInt(request.params.id, 10);

	var attribrutes = {};

  // NOTE: Although Sequelize will sanitize the input and Andrew said this is not necessary, I strongly believe
  //       we should keep this sanitazion, it's never harmful to have exra checks. this will avoid SQL injections
	if (body.hasOwnProperty('completed')){
		if(_.isBoolean(body.completed)){
			attribrutes.completed = body.completed;
		}else{
			return response.status(400).send("Wrong type for completed");
		}
	}  
	if (body.hasOwnProperty('description')){
		if(_.isString(body.description) && body.description.trim().length > 0){
			attribrutes.description = body.description;
		}else{
			return response.status(400).send("Wrong type or length for description");
		}
	} 
   // LESSON TIME: an instance method it's a method done on an already feteched object
   db.todo.findById(todoId).then( function (todo) {
   		if(todo){
   			return todo.update(attribrutes).then( function (todo) {    
   						response.json(todo.toJSON());  	
   			}, function (error) {
   				response.status(400).json(error);
   			});
   		}else{
   			response.status(404).send();
   		}
   }, function () {
   		response.status(500).send();
   });

});


app.post('/users', function (request, response) {
	body = _.pick(request.body, 'email', 'password');

	if(!body.hasOwnProperty('email') || !_.isString(body.email) || body.email.trim().length < 6){
		return response.status(400).send("Wrong email entry");
	}

	if(!body.hasOwnProperty('password') || !_.isString(body.password) || body.password.trim().length < 7){
		return response.status(400).send("Password does not meet requirements");
	}

	db.user.create(body).then( function (user) {
		response.status(200).json(user.toJSON());
	}, function (error) {
		response.status(500).json(error);
	});

});
//-> sync the database first, and then start the server. 
// {force: true}  -> use it inside sync to drop tables at the start of the program
db.sequelize.sync().then(function() {
	// At the end, you tell it to listen to specific port. 
	app.listen(PORT, function() {
		console.log('Server listering on port ' + PORT + ' ...');
	});
});