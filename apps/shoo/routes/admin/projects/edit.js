var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Project = Model.Project;
	var Category = Model.Category;
	var People = Model.People;

	var previewImages = Params.upload.preview;
	var uploadImages = Params.upload.images;
	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.project_id;

		Project.findById(id).exec(function(err, project) {
			if (err) return next(err);

			Category.find().exec(function(err, categorys) {
				if (err) return next(err);

				People.find().exec(function(err, peoples) {
					if (err) return next(err);

					previewImages(project.images, function(err, images_preview) {
						if (err) return next(err);

						res.render('admin/projects/edit.pug', { project: project, categorys: categorys, peoples: peoples, images_preview: images_preview });
					});
				});
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.project_id;

		Project.findById(id).exec(function(err, project) {
			if (err) return next(err);

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

				checkNested(post, [locale, 'level'])
					&& project.setPropertyLocalised('level', post[locale].level, locale);

				checkNested(post, [locale, 'location'])
					&& project.setPropertyLocalised('location', post[locale].location, locale);

				checkNested(post, [locale, 'brands'])
					&& project.setPropertyLocalised('brands', post[locale].brands, locale);

				checkNested(post, [locale, 'area'])
					&& project.setPropertyLocalised('area', post[locale].area, locale);

				checkNested(post, [locale, 'description'])
					&& project.setPropertyLocalised('description', post[locale].description, locale);

			});

			async.series([
				async.apply(uploadImages, project, 'projects', post.hold, post.images),
				async.apply(uploadImage, project, 'projects', 'logo', 400, files.logo && files.logo[0], post.logo_del),
				async.apply(uploadImage, project, 'projects', 'poster', 1200, files.poster && files.poster[0], post.poster_del),
			], function(err, results) {
				if (err) return next(err);

				project.save(function(err, project) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};