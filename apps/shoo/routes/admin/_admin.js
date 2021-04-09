var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });

var admin = {
	main: require('./main.js'),
	projects: require('./projects/_projects.js'),
	publications: require('./publications/_publications.js'),
	awards: require('./awards/_awards.js'),
	news: require('./news/_news.js'),
	peoples: require('./peoples/_peoples.js'),
	categorys: require('./categorys/_categorys.js'),
	cv: require('./cv.js'),
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

	router.route('/cv')
		.get(checkAuth, admin.cv.edit)
		.post(checkAuth, admin.cv.edit_form);

	router.use('/projects', checkAuth, upload.fields([ {name: 'poster'}, { name: 'logo' } ]), admin.projects);
	router.use('/publications', checkAuth, admin.publications);
	router.use('/awards', checkAuth, admin.awards);
	router.use('/news', checkAuth, upload.fields([ { name: 'poster' } ]), admin.news);
	router.use('/peoples', checkAuth, admin.peoples);
	router.use('/categorys', checkAuth, admin.categorys);
	router.use('/users', checkAuth, admin.users);

	router.post('/preview', checkAuth, upload.single('image'), admin.options.preview);

	return router;
})();