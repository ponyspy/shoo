var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Award = Model.Award;
	var Project = Model.Project;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.award_id;

		Award.findById(id).exec(function(err, award) {
			if (err) return next(err);

			Project.find().exec(function(err, projects) {
				if (err) return next(err);

				res.render('admin/awards/edit.pug', { award: award, projects: projects });
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var file = req.file;
		var id = req.params.award_id;

		Award.findById(id).exec(function(err, award) {
			if (err) return next(err);

			award.status = post.status;
			award.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			award.projects = post.projects.filter(function(project) { return project != 'none'; });

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& award.setPropertyLocalised('title', post[locale].title, locale);

			});

			award.save(function(err, award) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};