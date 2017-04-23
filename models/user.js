module.exports = function ( sequelize, DateTypes) {
	return sequelize.define('user', {
		email: {
			type: DateTypes.STRING,
			allowNull: false,
			unique: true,   //-->makes sure this email is unique in the database
			validate: {
				isEmail: true  //--> sequelize checks that it's an email
			}
		},
		password: {
			type: DateTypes.STRING,
			allowNull: false,
			validate: {        //--> lookup on documentation to add numbers and special characters
				len: [7,100]
			}
		}
	},{
		hooks: { //--> hooks run before you validate and run query
			beforeValidate: function (user, options) {
				if(typeof user.email === 'string'){
					user.email = user.email.toLowerCase();
				}
			}
		}
	}
	);
}