var sitemap = require('sitemap');
var pug = require('pug');

module.exports = function(Model, Params) {
	var module = {};

	var Project = Model.Project;
	var Category = Model.Category;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.search = function(req, res, next) {

		Category.find({ $text: { $search: req.body.text } }).where('status').nin(['hidden', 'special']).exec(function(err, categorys) {
			var categorys_ids = categorys.map(function(category) {
				return category._id;
			});

			var query = categorys_ids && categorys_ids.length > 0
				? { $or: [{ $text: { $search: req.body.text } }, { 'category': { $in: categorys_ids } }] }
				: { $text: { $search: req.body.text } }

			Project.find(query, { score: { $meta: 'textScore' } })
						 .where('status').ne('hidden').populate('category')
						 .exec(function(err, projects) {

				var opts = {
					__: function() { return res.locals.__.apply(null, arguments); },
					__n: function() { return res.locals.__n.apply(null, arguments); },
					get_locale: get_locale,
					projects: projects || [],
					locale: req.locale,
					compileDebug: false, debug: false, cache: false, pretty: false
				};

				res.send(pug.renderFile(__app_root + '/views/main/projects/_projects.pug', opts));
			});
		});
	};

	module.sitemap = function(req, res, next) {

		Project.where('status').ne('hidden').exec(function(err, projects) {
			var sm_stream = new sitemap.SitemapStream({ hostname: 'https://' + req.hostname });
			var links = [
				{ url: '/' },
				// { url: '/news' },
				// { url: '/publications' },
				{ url: '/projects' },
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