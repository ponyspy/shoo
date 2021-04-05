var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Project.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			rimraf(__glob_root + '/public/cdn/' + __app_name + '/projects/' + id, { glob: false }, function(err) {
				if (err) return next(err);

				res.send('ok');
			});
		});

	};


	return module;
};