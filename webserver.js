var express = require('express');
var app = express();

/*		HEROKU LESSON
 ---> Heroku establishes its own port, you can ask for this port thorugh the process.env.PORT 
*/
var PORT = process.env.PORT || 3000;



// --> The class had the index.html inside a public directory 
//     so you might do  __dirname +'/public'
app.use(express.static(__dirname));
// console.log(__dirname);


// At the end, you tell it to listen to specific port. 
app.listen(PORT, function () {
	console.log('Server listering on port ' + PORT + ' ...');
});
