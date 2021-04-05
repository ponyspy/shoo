var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload'),
	helpers: require('../_params/helpers')
};

var projects = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(projects.list.index)
		.post(projects.list.get_list);

	router.route('/add')
		.get(projects.add.index)
		.post(projects.add.form);

	router.route('/edit/:project_id')
		.get(projects.edit.index)
		.post(projects.edit.form);

	router.route('/remove')
		.post(projects.remove.index);

	return router;
})();