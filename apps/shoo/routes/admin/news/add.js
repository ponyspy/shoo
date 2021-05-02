var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var News = Model.News;

	var checkNested = Params.locale.checkNested;
	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		res.render('admin/news/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var news_item = new News();

		news_item._short_id = shortid.generate();
		news_item.status = post.status;
		news_item.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		news_item.sym = post.sym ? post.sym : undefined;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& news_item.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'intro'])
				&& news_item.setPropertyLocalised('intro', post[locale].intro, locale);

			checkNested(post, [locale, 'description'])
				&& news_item.setPropertyLocalised('description', post[locale].description, locale);
		});

		async.series([
			async.apply(uploadImage, news_item, 'news', 'poster', 1920, files.poster && files.poster[0], null),
		], function(err, results) {
			if (err) return next(err);

			news_item.save(function(err, news_item) {
				if (err) return next(err);

				res.redirect('/admin/news');
			});
		});
	};


	return module;
};