var moment = require('moment');
var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;
	var Award = Model.Award;
	var Publication = Model.Publication;
	var Category = Model.Category;

	module.index = function(req, res, next) {
		Project.find().where('status').ne('hidden').sort('-build_date').populate('category').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/projects/index.pug', {projects: projects});
		});
	};

	module.projects_type = function(req, res, next) {
		if (req.app.locals.static_types.projects_types.indexOf(req.params.type) == -1) return next();

		res.render('main/projects/type.pug', {'current_type': req.params.type});
	};

	module.get_type = function(req, res, next) {
		if (req.app.locals.static_types.projects_types.indexOf(req.params.type) == -1) return next();

		Category.findOne({'$or': [{ '_short_id': req.body.context.category }, { 'sym': req.body.context.category }]}).exec(function(err, category) {
			var skip = +req.body.context.skip || 0;
			var limit = +req.body.context.limit || 0;

			var query = category ? {'type': req.params.type, 'category': category._id} : {'type': req.params.type };

			Project.find(query).where('status').ne('hidden').skip(skip).limit(limit).sort('-build_date').populate('category').exec(function(err, projects) {
				if (err) return next(err);

				var opts = {
					locale: req.locale,
					projects: projects,
					__: function() { return res.locals.__.apply(null, arguments); },
					__n: function() { return res.locals.__n.apply(null, arguments); },
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				res.send(projects.length ? pug.renderFile(__app_root + '/views/main/projects/_projects.pug', opts) : 'end');
			});
		});
	}

	module.project = function(req, res, next) {
		if (req.app.locals.static_types.projects_types.indexOf(req.params.type) == -1) return next();

		var id = req.params.project_id;

		Project.findOne({'$or': [{ '_short_id': id }, { 'sym': id }]}).where('status').ne('hidden').populate('category peoples').exec(function(err, project) {
			if (!project || err) return next(err);

			var images = project.images.reduce(function(prev, curr) {
				if (prev.length && curr.gallery == prev[prev.length - 1][0].gallery) {
					prev[prev.length - 1].push(curr);
				} else {
					prev.push([curr]);
				}

				return prev;
			}, []).reduce(function(prev, curr) {
				if (curr.some(function(item) { return item.gallery == true; }) && curr.length > 1) {
					return prev.concat([curr]);
				} else {
					return prev.concat(curr);
				}
			}, []);

			Award.find({projects: project._id}).where('status').ne('hidden').sort('-date').exec(function(err, awards) {
				if (err) return next(err);

				Publication.find({projects: project._id}).where('status').ne('hidden').sort('-date').exec(function(err, publications) {
					if (err) return next(err);

					var category = project.category ? project.category._id : {'$ne': 'none'};

					Project.aggregate().match({
						'type': project.type, '_id': {'$ne': project._id},
						'category': category , 'status': {'$ne': 'hidden'}
						}).sample(2).exec(function(err, sim_projects) {
						if (err) return next(err);

						var get_locale = function(option, lg) {
							return ((option.filter(function(locale) {
								return locale.lg == lg;
							})[0] || {}).value || '');
						};

						res.render('main/projects/project.pug', {
							get_locale: get_locale, moment: moment,
							project: project, awards: awards, images: images,
							publications: publications, sim_projects: sim_projects,
						});
					});
				});
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
					$addToSet: '$category'
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