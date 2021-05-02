var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Project = Model.Project;
	var Category = Model.Category;
	var People = Model.People;

	var uploadImages = Params.upload.images;
	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		People.find().exec(function(err, peoples) {
			if (err) return next(err);

			Category.find().exec(function(err, categorys) {
				if (err) return next(err);

				res.render('admin/projects/add.pug', { categorys: categorys, peoples: peoples });
			});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var project = new Project();

		project._short_id = shortid.generate();
		project.status = post.status;
		project.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		project.build_date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		project.category = post.category == 'none' ? undefined : post.category;
		project.main = post.main == 'none' ? undefined : post.main;
		project.peoples = post.peoples == 'none' ? [] : post.peoples;
		project.year = post.year;
		project.type = post.type;
		project.sym = post.sym ? post.sym : undefined;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& project.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'intro'])
				&& project.setPropertyLocalised('intro', post[locale].intro, locale);

			checkNested(post, [locale, 'area'])
				&& project.setPropertyLocalised('area', post[locale].area, locale);

			checkNested(post, [locale, 'location'])
				&& project.setPropertyLocalised('location', post[locale].location, locale);

			checkNested(post, [locale, 'brands'])
				&& project.setPropertyLocalised('brands', post[locale].brands, locale);

			checkNested(post, [locale, 'level'])
				&& project.setPropertyLocalised('level', post[locale].level, locale);

			checkNested(post, [locale, 'description'])
				&& project.setPropertyLocalised('description', post[locale].description, locale);

		});

		async.series([
			async.apply(uploadImages, project, 'projects', null, post.images),
			async.apply(uploadImage, project, 'projects', 'logo', 400, files.logo && files.logo[0], null),
			async.apply(uploadImage, project, 'projects', 'poster', 1920, files.poster && files.poster[0], null),
		], function(err, results) {
			if (err) return next(err);

			project.save(function(err, project) {
				if (err) return next(err);

				res.redirect('/admin/projects');
			});
		});
	};


	return module;
};