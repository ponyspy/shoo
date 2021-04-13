var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var News = Model.News;

	module.index = function(req, res, next) {
		News.find().where('status').ne('hidden').exec(function(err, news) {
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

	return module;
};