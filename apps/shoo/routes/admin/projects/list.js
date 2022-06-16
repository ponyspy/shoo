var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;


	module.index = function(req, res, next) {
		Project.find().sort('-date').limit(10).exec(function(err, projects) {
			if (err) return next(err);

			Project.countDocuments().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/projects', {projects: projects, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Project.find({ $text : { $search : post.context.text } } )
			: Project.find();

		if (post.context.type && post.context.type != 'all') {
			Query.where('type').equals(post.context.type);
		}

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.clone().countDocuments(function(err, count) {
			if (err) return next(err);

			Query.clone().find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, projects) {
				if (err) return next(err);

				if (projects.length > 0) {
					var opts = {
						projects: projects,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/projects/_projects.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};