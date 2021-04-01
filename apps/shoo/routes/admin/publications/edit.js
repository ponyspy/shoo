var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Publication = Model.Publication;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.publication_id;

		Publication.findById(id).exec(function(err, publication) {
			if (err) return next(err);

			res.render('admin/publications/edit.pug', { publication: publication });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.publication_id;

		Publication.findById(id).exec(function(err, publication) {
			if (err) return next(err);

			publication.status = post.status;
			publication.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			publication.link = post.link;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& publication.setPropertyLocalised('title', post[locale].title, locale);

			});


			publication.save(function(err, publication) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};