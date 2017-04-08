var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'meet mom for lunch',
	completed: false
},
	{
	id: 2,
	description: 'Go grocieries',
	completed: false
},
	{
	id: 3,
	description: 'Grind!!',
	completed: true
},
];


app.get('/todos', function (request, response) {
	response.json(todos);
});

// --> The class had the index.html inside a public directory 
//     so you might do  __dirname +'/public'
app.use(express.static(__dirname));


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
function getTask(id){
    var len = todos.length
	for(var i = 0; i < len;  i++){
		if (todos[i].id === id){
			console.log("Found the task: " + todos[i].description);
			return todos[i];			
		}
	}
	console.log('Did\'t find the task');
	return null;
}

/** LESSON TIME:   Accessing argumens from url and sending error statuses 
	1- Express uses the colon : to parse the data, so that you can use it 
	2- You can access this data through the request:
			request.params.id  (no need to use colon)  
	3- You can pass as many parameters as you want in the urls.
	4- Send an error status if you can't find a result
		response.status(404).send('Not found');
 **/

app.get('/todos/:id', function (request, response){
	var id = parseInt(request.params.id,10);
	var myTask = getTask(id);
	if(myTask){
		response.status(202).json(myTask);
	}else{
		console.log('It did not find the task');
		response.status(404).send();
	}
});

// At the end, you tell it to listen to specific port. 
app.listen(PORT, function () {
	console.log('Server listering on port ' + PORT + ' ...');
});
