module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;
	var People = Model.People;
	var Publication = Model.Publication;
	var Award = Model.Award;

	module.index = function(req, res, next) {
		Project.find({'main': {'$exists': true}}).where('status').ne('hidden').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/index.pug', {projects: projects});
		});
	};

	module.about = function(req, res, next) {
		People.find().where('status').nin(['hidden', 'special']).exec(function(err, peoples) {
			if (err) return next(err);

			Publication.find().where('status').ne('hidden').exec(function(err, publications) {
				if (err) return next(err);

				Award.find().where('status').ne('hidden').exec(function(err, awards) {
					if (err) return next(err);

					res.render('main/about.pug', {peoples: peoples, publications: publications, awards: awards});
				});
			});
		});
	};

	return module;
};