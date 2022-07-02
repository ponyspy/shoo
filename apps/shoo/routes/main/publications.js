var moment = require('moment');
var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Publication = Model.Publication;

	module.index = function(req, res, next) {
		res.render('main/publications/index.pug');
	};

	module.get_publications = function(req, res, next) {
		var skip = +req.body.context.skip || 0;
		var limit = +req.body.context.limit || 0;

		Publication.find().where('status').ne('hidden').sort('-date').skip(skip).limit(limit).exec(function(err, publications) {
			if (err) return next(err);

			var opts = {
				locale: req.locale,
				publications: publications,
				moment: moment,
				__: function() { return res.locals.__.apply(null, arguments); },
				__n: function() { return res.locals.__n.apply(null, arguments); },
				compileDebug: false, debug: false, cache: true, pretty: false
			};

			res.send(publications.length ? pug.renderFile(__app_root + '/views/main/publications/_publications.pug', opts) : 'end');
		});
	}

	return module;
};