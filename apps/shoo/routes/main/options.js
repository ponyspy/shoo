var sitemap = require('sitemap');

module.exports = function(Model, Params) {
	var module = {};

	var Work = Model.Work;

	module.sitemap = function(req, res, next) {

		Work.where('status').ne('hidden').exec(function(err, works) {
			var arr_works = works.map(function(work) {
				return {
					url: '/works/' + (work.sym ? work.sym : work._short_id)
				};
			});

			var site_map = sitemap.createSitemap({
				hostname: 'https://' + req.hostname,
				// cacheTime: 600000,
				urls: [
					{ url: '/' },
				].concat(arr_works)
			});

			site_map.toXML(function (err, xml) {
				if (err) return next(err);

				res.type('xml').send(xml);
			});

		});
	};


	return module;
};