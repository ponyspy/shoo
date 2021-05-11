var async = require('async');
var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;
	var Award = Model.Award;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Award.update({'projects': id}, { $pull: { 'projects': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Project.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/projects/' + id, { glob: false }, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});

	};


	return module;
};