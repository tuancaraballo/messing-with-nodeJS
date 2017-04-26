module.exports = function (db) {

	return {
		requireAuthentication: function (request, response, next) {
			var token = request.get('Auth');

			db.user.findByToken(token).then(function (user) {
				request.user = user;
				next();
			}, function () {
				//--> BY not calling next, it wont move on to the route handler, it will
				// just stop ere
				response.status(401).send();
			});
		}
	}
}