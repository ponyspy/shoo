var sitemap = require('sitemap');

module.exports = function(Model, Params) {
	var module = {};

	var Project = Model.Project;

	module.sitemap = function(req, res, next) {

		Project.where('status').ne('hidden').exec(function(err, projects) {
			var sm_stream = new sitemap.SitemapStream({ hostname: 'https://' + req.hostname });
			var links = [
				{ url: '/' },
				{ url: '/news' },
				{ url: '/about' }
			];

			links.forEach(function(link) {
				sm_stream.write(link);
			});

			projects.forEach(function(project) {
				sm_stream.write({ url: '/' + project.type + '/' + (project.sym ? project.sym : project._short_id) })
			});

			sm_stream.end();

			sm_stream.pipe(res).on('error', function(err) {
				return next(err);
			});
		});
	};


	return module;
};