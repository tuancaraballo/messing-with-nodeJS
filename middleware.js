var cryptojs = require('crypto-js');
module.exports = function (db) {

	return {
		requireAuthentication: function (request, response, next) {
			var token = request.get('Auth') || '';

 // Step 1: Look for the token in the DB
 //         based on the value the user has on the Auth header
			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
// Step 2: If we find the token in the token Table, look up the user				
			}).then( function (tokenInstance){
				if(!tokenInstance){
					throw new Error();
				}		
				request.token = tokenInstance;//-> if you find the token, save it in the request, so that
											  //  you can delete it from DB if you need to.
				return db.user.findByToken(token);
// Step 3: If you find the user, next
			}).then(function (user) {
				request.user = user;
				next();
			}).catch ( function () {
				response.status(401).send();
			});
		}
	};
};