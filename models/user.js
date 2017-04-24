var bcryptjs = require('bcryptjs');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', { //-> NOTICE here how we save it and return
		email: {						// it at the end of this code
			type: DataTypes.STRING,		// this will allow you to use the user variable
			allowNull: false,          //  in the functions you defined in classMethods
			unique: true, //-->makes sure this email is unique in the database
			validate: {
				isEmail: true //--> sequelize checks that it's an email
			}
		},
		salt: { //--> this is added to the end of the password before it's hashed
			// just in case two users have the same password, they don't share
			// the same hash
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		// --> In sequelize virtual is a datatype that is accessible, but not stored in the db
		// this is useful because we can override the set functionality.So when we set a text plain 
		// password on a useroObject, we should salt it and hash it.
		// --> Thus the password won't be stored in the database bc it's virtual, but the
		//     salt will 	
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: { //--> lookup on documentation to add numbers and special characters
				len: [7, 100]
			},
			set: function(value) { //-> the value is the password
				var salt = bcryptjs.genSaltSync(10); //--> to salt the password;
				var hashedPassword = bcryptjs.hashSync(value, salt); // 1arg is password, 2nd: salt
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: { //--> hooks run before you validate and run query
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function (resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject("Wrong username and password");
					}
					user.findOne({ //--> NOTICE, here you don't user db, but just user
						where: {
							email: body.email,
						}
					}).then(function(theUser) { //--> LESSON: see how you use compareSync and pasword_hash
						if (!theUser || !bcryptjs.compareSync(body.password, theUser.get('password_hash'))) {
							return reject("Wrong username and password");
						}
						return resolve(theUser);
					}, function(error) {
						return reject("Wrong username and password");
					});
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
	return user;
};