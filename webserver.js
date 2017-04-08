var express = require('express');
var app = express();

/*		HEROKU LESSON
 ---> Heroku establishes its own port, you can ask for this port thorugh the process.env.PORT 
*/
var PORT = process.env.PORT || 3000;



app.get('/', function (request, response) {
	response.send('TODO API Root');
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});