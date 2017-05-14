// The purpose of this is to store the tokens
// we are going to be storing the hash value of the tokens
// we never want to store something in the database that is 
// unencrypted or hash. A token lets you access data
// so it's better to hash it.


var cryptojs = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('token', {
		token: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [1]
			},
			set: function (value) {
				var hash = cryptojs.MD5(value).toString(); //--> MD5 is another crypto algoritym
				this.setDataValue ('token', value);
				this.setDataValue('tokenHash', hash);
			}
		},
		tokenHash: DataTypes.STRING //-> This is the only Column/attribute in this table
	})
};