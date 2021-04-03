var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Work = Model.Work;
	var Category = Model.Category;
	var People = Model.People;

	var uploadImages = Params.upload.images;
	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;
	var youtubeId = Params.helpers.youtubeId;
	var vimeoId = Params.helpers.vimeoId;


	module.index = function(req, res, next) {
		People.find().exec(function(err, peoples) {
			if (err) return next(err);

			Category.find().exec(function(err, categorys) {
				if (err) return next(err);

				res.render('admin/works/add.pug', { categorys: categorys, peoples: peoples });
			});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var work = new Work();

		work._short_id = shortid.generate();
		work.status = post.status;
		work.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		work.build_date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		work.category = post.category == 'none' ? undefined : post.category;
		work.main = post.main == 'none' ? undefined : post.main;
		work.peoples = post.peoples == 'none' ? [] : post.peoples;
		work.year = post.year;
		work.type = post.type;
		work.sym = post.sym ? post.sym : undefined;

		if (youtubeId(post.embed)) {
			work.embed = {
				provider: 'youtube',
				id: youtubeId(post.embed)
			}
		} else if (vimeoId(post.embed)) {
			work.embed = {
				provider: 'vimeo',
				id: vimeoId(post.embed)
			}
		} else {
			work.embed = undefined;
		}

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& work.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'area'])
				&& work.setPropertyLocalised('area', post[locale].area, locale);

			checkNested(post, [locale, 'location'])
				&& work.setPropertyLocalised('location', post[locale].location, locale);

			checkNested(post, [locale, 'level'])
				&& work.setPropertyLocalised('level', post[locale].level, locale);

			checkNested(post, [locale, 'description'])
				&& work.setPropertyLocalised('description', post[locale].description, locale);

		});

		async.series([
			async.apply(uploadImages, work, 'works', null, post.images),
			async.apply(uploadImage, work, 'works', 'poster', 1200, files.poster && files.poster[0], null),
		], function(err, results) {
			if (err) return next(err);

			work.save(function(err, work) {
				if (err) return next(err);

				res.redirect('/admin/works');
			});
		});
	};


	return module;
};