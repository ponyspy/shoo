var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Publication = Model.Publication;
	var Project = Model.Project;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		Project.find().exec(function(err, projects) {
			if (err) return next(err);

			res.render('admin/publications/add.pug', {projects: projects});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var publication = new Publication();

		publication._short_id = shortid.generate();
		publication.status = post.status;
		publication.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		publication.link = post.link;
		publication.projects = post.projects.filter(function(project) { return project != 'none'; });

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& publication.setPropertyLocalised('title', post[locale].title, locale);

		});

		publication.save(function(err, publication) {
			if (err) return next(err);

			res.redirect('/admin/publications');
		});
	};


	return module;
};