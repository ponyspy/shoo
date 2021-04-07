module.exports = function(Model) {
	var module = {};

	var News = Model.News;

	module.index = function(req, res, next) {
		News.find().where('status').ne('hidden').exec(function(err, news) {
			if (err) return next(err);

			res.render('main/news/index.pug', {news: news});
		});
	};

	module.news = function(req, res, next) {
		var id = req.params.news_id;

		News.findOne({'$or': [{ '_short_id': id }, { 'sym': id }]}).where('status').ne('hidden').exec(function(err, news) {
			if (err) return next(err);

			res.render('main/news/news.pug', {news: news});
		});
	};

	return module;
};