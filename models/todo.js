var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING, //->notice how here you use DataTypes and not Sequelize
			allowNull: false, // --> this allow  this field to be optional
			validate: {
				// noEmpty : true// --> this prevent users from entering empty strings
				len: [1, 250]
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false // --> sets default value in case the user doesn't enter it
		}
	}, 
	{
  		validate: {
    		validateTypes: function() {
      			if (!_.isBoolean(this.completed)){
      				throw new Error('Incorrect type for completed');
      			} 
      			console.log('This is the typeof description:');
      			console.log(typeof this.description);
      			if (_.isString(this.description) == false){
        			throw new Error('Incorrect type for description');
      			}
    		}	
  		}
  	}	
	);
};