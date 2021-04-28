var sitemap = require('sitemap');
var pug = require('pug');

module.exports = function(Model, Params) {
	var module = {};

	var Project = Model.Project;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.search = function(req, res, next) {

		Project.find({ $text: { $search: req.body.text } }, { score: { $meta: 'textScore' } })
					 .where('status').ne('hidden').sort( { score: { $meta: 'textScore' } } ).populate('category')
					 .exec(function(err, projects) {

			var opts = {
				__: function() { return res.locals.__.apply(null, arguments); },
				__n: function() { return res.locals.__n.apply(null, arguments); },
				get_locale: get_locale,
				projects: projects,
				locale: req.locale,
				compileDebug: false, debug: false, cache: false, pretty: false
			};

			res.send(pug.renderFile(__app_root + '/views/main/projects/_projects.pug', opts));
		});
	};

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