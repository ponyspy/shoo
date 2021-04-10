module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;
	var Award = Model.Award;
	var Category = Model.Category;

	module.index = function(req, res, next) {
		Project.find().where('status').ne('hidden').populate('category').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/projects/index.pug', {projects: projects});
		});
	};

	module.projects_type = function(req, res, next) {
		if (req.app.locals.static_types.projects_types.indexOf(req.params.type) == -1) return next();

		Project.find({'type': req.params.type}).where('status').ne('hidden').populate('category').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/projects/type.pug', {'current_type': req.params.type,  projects: projects});
		});
	};

	module.project = function(req, res, next) {
		if (req.app.locals.static_types.projects_types.indexOf(req.params.type) == -1) return next();

		var id = req.params.project_id;

		Project.findOne({'$or': [{ '_short_id': id }, { 'sym': id }]}).where('status').ne('hidden').populate('category peoples').exec(function(err, project) {
			if (!project || err) return next(err);

			Award.find({projects: project._id}).exec(function(err, awards) {
				if (err) return next(err);

				res.render('main/projects/project.pug', {project: project, awards: awards});
			});
		});
	};

	module.map_categorys = function(req, res, next) {
		if (/admin|auth/.test(req.originalUrl)) return next();
		if (req._parsedUrl.pathname !== '/' && !/about|projects|news/.test(req.originalUrl)) return next();

		Project.aggregate([
			{ $group: {
				_id: '$type',
				categorys: {
					$push: '$category'
			}}},
			{ $project: {
				_id: 0,
				'type': '$_id',
				'categorys': '$categorys'
			}}
		]).exec(function(err, types) {
			Category.populate(types, {path: 'categorys'}, function(err, types) {
				var actual_types = req.app.locals.static_types.projects_types;

				types.sort(function(a, b) {
					return actual_types.indexOf(a.type) - actual_types.indexOf(b.type);
				});

				res.locals.project_types = types;

				return next();
			});
		});
	}

	return module;
};