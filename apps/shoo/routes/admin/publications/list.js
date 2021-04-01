var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Publication = Model.Publication;


	module.index = function(req, res, next) {
		Publication.find().sort('-date').limit(10).exec(function(err, publications) {
			if (err) return next(err);

			Publication.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/publications', {publications: publications, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Publication.find({ $text : { $search : post.context.text } } )
			: Publication.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, publications) {
				if (err) return next(err);

				if (publications.length > 0) {
					var opts = {
						publications: publications,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/publications/_publications.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};