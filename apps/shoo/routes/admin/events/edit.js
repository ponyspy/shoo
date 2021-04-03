var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Event = Model.Event;

	var checkNested = Params.locale.checkNested;
	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		var id = req.params.event_id;

		Event.findById(id).exec(function(err, event) {
			if (err) return next(err);

			res.render('admin/events/edit.pug', { event: event });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.event_id;

		Event.findById(id).exec(function(err, event) {
			if (err) return next(err);

			event.status = post.status;
			event.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& event.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& event.setPropertyLocalised('description', post[locale].description, locale);

			});

			async.series([
				async.apply(uploadImage, event, 'events', 'poster', 1200, files.poster && files.poster[0], post.poster_del),
			], function(err, results) {
				if (err) return next(err);

				event.save(function(err, event) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};