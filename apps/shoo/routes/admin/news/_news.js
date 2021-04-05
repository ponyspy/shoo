var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload'),
	helpers: require('../_params/helpers')
};

var news = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(news.list.index)
		.post(news.list.get_list);

	router.route('/add')
		.get(news.add.index)
		.post(news.add.form);

	router.route('/edit/:news_item_id')
		.get(news.edit.index)
		.post(news.edit.form);

	router.route('/remove')
		.post(news.remove.index);

	return router;
})();