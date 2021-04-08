var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	projects: require('./projects.js')(Model),
	news: require('./news.js')(Model),
	options: require('./options.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.use(main.projects.map_categorys);

	router.route('/')
		.get(main.index.index);

	router.route('/about')
		.get(main.index.about);

	router.route('/news')
		.get(main.news.index);

	router.route('/news/:news_id')
		.get(main.news.news);

	router.route('/projects')
		.get(main.projects.index);

	router.route('/projects/:type')
		.get(main.projects.projects_type);

	router.route('/projects/:type/:project_id')
		.get(main.projects.project);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();