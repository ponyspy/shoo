module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;
	var Award = Model.Award;

	module.index = function(req, res, next) {
		Project.find().where('status').ne('hidden').populate('category').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/projects/index.pug', {projects: projects});
		});
	};

	module.projects_type = function(req, res, next) {
		Project.find({'type': req.params.type}).where('status').ne('hidden').populate('category').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/projects/category.pug', {projects: projects});
		});
	};

	module.project = function(req, res, next) {
		Project.findOne({'$or': [{ '_short_id': id }, { 'sym': id }]}).where('status').ne('hidden').populate('category peoples').exec(function(err, project) {
			if (err) return next(err);

			Award.find({projects: project._id}).exec(function(err, awards) {
				if (err) return next(err);

				res.render('main/projects/project.pug', {project: project, awards: awards});
			});
		});
	};

	return module;
};