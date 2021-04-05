var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Category = Model.Category;
	var Project = Model.Project;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Project.update({'category': id}, { $unset: { 'category': 1 } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Category.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};