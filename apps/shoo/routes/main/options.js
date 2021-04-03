var sitemap = require('sitemap');

module.exports = function(Model, Params) {
	var module = {};

	var Work = Model.Work;

	module.sitemap = function(req, res, next) {

		Work.where('status').ne('hidden').exec(function(err, works) {
			var smStream = new sitemap.SitemapStream({ hostname: 'https://' + req.hostname });

			smStream.write({ url: '/' });
			smStream.write({ url: '/about' });

			works.forEach(function(work) {
				smStream.write({ url: '/works/' + (work.sym ? work.sym : work._short_id) })
			});

			smStream.end();

			smStream.pipe(res).on('error', function(err) {
				return next(err);
			});
		});
	};


	return module;
};