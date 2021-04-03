var sitemap = require('sitemap');

module.exports = function(Model, Params) {
	var module = {};

	var Work = Model.Work;

	module.sitemap = function(req, res, next) {

		Work.where('status').ne('hidden').exec(function(err, works) {
			var sm_stream = new sitemap.SitemapStream({ hostname: 'https://' + req.hostname });
			var links = [
				{ url: '/' },
				{ url: '/about' }
			];

			links.forEach(function(link) {
				sm_stream.write(link);
			});

			works.forEach(function(work) {
				sm_stream.write({ url: '/' + work.type + '/' + (work.sym ? work.sym : work._short_id) })
			});

			sm_stream.end();

			sm_stream.pipe(res).on('error', function(err) {
				return next(err);
			});
		});
	};


	return module;
};