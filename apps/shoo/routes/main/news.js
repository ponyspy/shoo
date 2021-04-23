var moment = require('moment');
var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var News = Model.News;

	module.index = function(req, res, next) {
		News.find().where('status').ne('hidden').sort('-date').exec(function(err, news) {
			if (err) return next(err);

			res.render('main/news/index.pug', {news: news, moment: moment});
		});
	};

	module.news = function(req, res, next) {
		var id = req.params.news_id;

		var get_locale = function(option, lg) {
			return ((option.filter(function(locale) {
				return locale.lg == lg;
			})[0] || {}).value || '');
		};

		News.findOne({'$or': [{ '_short_id': id }, { 'sym': id }]}).where('status').ne('hidden').exec(function(err, news) {
			if (err) return next(err);

			News.aggregate().match({
				'_id': {'$ne': news._id},
				'status': {'$ne': 'hidden'}
				}).sample(2).exec(function(err, sim_news) {
				if (err) return next(err);

				res.render('main/news/news.pug', {get_locale: get_locale, news: news, sim_news: sim_news, moment: moment});
			});
		});
	};

	module.get_news = function(req, res, next) {
		var skip = +req.body.context.skip || 0;
		var limit = +req.body.context.limit || 0;

		News.find().where('status').ne('hidden').sort('-date').skip(skip).limit(limit).exec(function(err, news) {
			if (err) return next(err);

			var opts = {
				locale: req.locale,
				news: news,
				moment: moment,
				__: function() { return res.locals.__.apply(null, arguments); },
				__n: function() { return res.locals.__n.apply(null, arguments); },
				compileDebug: false, debug: false, cache: true, pretty: false
			};

			res.send(news.length ? pug.renderFile(__app_root + '/views/main/news/_news.pug', opts) : 'end');
		});
	}

	return module;
};