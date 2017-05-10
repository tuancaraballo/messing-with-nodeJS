1- Install Squilize module
  
   npm install sequelize --save

2- Install sqlite

	npm instal sqlite3 --save


3- You will save the data inside the de data folfer, where you have the .keep file

server.js will request the data from db.js, which will get it from the data that
you stored there. 

In the example use here:

todo.js is just the model
db.js is sequelize that creates a database from the model .
server.js calls db 

4- Notice that if you try to add elements with the same id to the database
you will get an error back, to drop all tables at the beginnning for  testing
purposes, then just  add the {force: true} inside sync


5- To use postgres for heroku,

  then in the terminal:
  	heroku addons:create heroku-postgresql:hobby-dev	


5.1 To use postgres in you app:
	npm install pg --save
	npm install pg-hstore --save

	Then in your basic sqlite file.js 
		substitue in db.js 
		'dialect': "postgres",


Enviroment variables:
In node you have environment variables, these variables depend on where node is run and various
convigutations.
One of these environment variables is env.This is set in production in heroku
In heroku:

   if env_ = production -> use postgres, if not then use sqlite


6 - Password validation:
	- Add a layer in the js method (suggested by you)
	- In sequelize also have a validation method 
	- Consider lower casing everything, that Tuan and tuan are the same username 
	- Use hooks
	
7- Hooks:
	- Allow you to run code before and after something has happened 
	- You set a hook in the model (user.js or todo.js) document, and it runs before the validation
	- This way, hooks allow you to lowercase any input before you query the database

8- Encrypting Password using hashing

 - npm install bcryptjs --save  (the original was brcrypt, but it gives tons of error with mac) 
 - Add the code for salting and hashing the password, remember the password is not 
   stored in the database, bc it is virtual.
 - Remember to not send back to the user the salt, password and password_hash, do so
   by adding the instanceMethod after the hooks portion of the Model, and on the server.js
   fle, instead of calling toJSON, call toPublicJSON that you defined in the model hooks

 8- Using a webtoken:
    npm install jsonwebtoken  --save
    npm install crypto-js --save

 9- Relating two tables:
 	use: 
 		db.todo.belongsTo(db.user);
 		db.user.hasMany(db.todo);

 	see in post todos how you use the method reload




