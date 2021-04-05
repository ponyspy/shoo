var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Award = Model.Award;
	var Project = Model.Project;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		Project.find().exec(function(err, projects) {
			if (err) return next(err);

			res.render('admin/awards/add.pug', {projects: projects});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var file = req.file;

		var award = new Award();

		award._short_id = shortid.generate();
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

			res.redirect('/admin/awards');
		});
	};


	return module;
};