module.exports = function(Model) {
	var module = {};

	module.index = function(req, res) {
		res.render('main/projects/index.pug');
	};

	module.projects_category = function(req, res) {
		res.render('main/projects/category.pug');
	};

	module.project = function(req, res) {
		res.render('main/projects/project.pug');
	};

	return module;
};