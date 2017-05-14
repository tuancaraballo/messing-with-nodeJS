var bcryptjs = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

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
						console.log('wrong user password!')
						return reject("Wrong username and password");
					}
					user.findOne({ //--> NOTICE, here you don't user db, but just user
						where: {
							email: body.email
						}
					}).then(function(theUser) { //--> LESSON: see how you use compareSync and pasword_hash
						if (!theUser || !bcryptjs.compareSync(body.password, theUser.get('password_hash'))) {
							console.log('wrong user password!!')
							return reject("Wrong username and password");
						}
						return resolve(theUser);
					}, function(error) {
						console.log('wrong user password!!!')
						return reject("Wrong username and password");
					});
				});
			},
			findByToken: function (token) {
				return new Promise( function (resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token,'qwerty098');//-> it verifies that the passwords matches the token
						var bytes = cryptojs.AES.decrypt(decodedJWT.token,'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
						//from user youd defined above
						user.findById(tokenData.id).then( function (theUser) {
							if(theUser){
								resolve(theUser);
							}else {
								reject();
							}
						}, function (error) {
							reject()
						});
					}catch (e) {
						reject();
					}
				});
			}
		},
/* LESSON TIME: difference between classMethods vs instanceMethods:
	instanceMethods are used when you work with an already instantiated object,
	classMethods however, are for the class, you don't need an instantiated object
	to use them. Think about classMethods as being methods to apply to the blueprint
	of a house, and instanceMethods methods to apply to the house that you built
	using that bluprint, some instance methods could be, paintHouse(blue), while
	a classMethod coud be getHouseColor()

	In this code, You can only call toPublicJSON on an already instantiated object while
	authenticate is not a method called on an object, but it's called by itself.
*/

		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function (type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					//-> you take the data of the json, and convert it into a string
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					//->because crypto only knows how to encrypt strings
					//-> it takes the data you want to encrypt and a key
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
					//-> using webToken
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}
	});
	return user;
};