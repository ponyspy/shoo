var async = require('async');

module.exports = function(Model) {
	var module = {};

	var People = Model.People;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Project.update({'peoples': id}, { $pull: { 'peoples': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				People.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});

	};


	return module;
};