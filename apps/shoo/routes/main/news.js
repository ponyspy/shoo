module.exports = function(Model) {
	var module = {};

	module.index = function(req, res) {
		res.render('main/news/index.pug');
	};

	module.news = function(req, res) {
		res.render('main/news/news.pug');
	};

	return module;
};