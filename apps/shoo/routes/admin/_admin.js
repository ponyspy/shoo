var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });

var admin = {
	main: require('./main.js'),
	projects: require('./projects/_projects.js'),
	publications: require('./publications/_publications.js'),
	news: require('./news/_news.js'),
	peoples: require('./peoples/_peoples.js'),
	categorys: require('./categorys/_categorys.js'),
	about: require('./about.js'),
	users: require('./users/_users.js'),
	options: require('./options.js')
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.route('/').get(checkAuth, admin.main.index);

	router.route('/about')
		.get(checkAuth, admin.about.edit)
		.post(checkAuth, upload.fields([ {name: 'image_1'}, { name: 'image_2' } ]), admin.about.edit_form);

	router.use('/projects', checkAuth, upload.fields([ {name: 'poster'}, { name: 'logo' } ]), admin.projects);
	router.use('/publications', checkAuth, upload.fields([ { name: 'poster' } ]), admin.publications);
	router.use('/news', checkAuth, upload.fields([ { name: 'poster' } ]), admin.news);
	router.use('/peoples', checkAuth, admin.peoples);
	router.use('/categorys', checkAuth, admin.categorys);
	router.use('/users', checkAuth, admin.users);

	router.post('/preview', checkAuth, upload.single('image'), admin.options.preview);

	return router;
})();