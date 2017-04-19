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
