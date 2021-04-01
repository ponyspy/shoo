var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Award = Model.Award;
	var Work = Model.Work;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.award_id;

		Award.findById(id).exec(function(err, award) {
			if (err) return next(err);

			Work.find().exec(function(err, works) {
				if (err) return next(err);

				res.render('admin/awards/edit.pug', { award: award, works: works });
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var file = req.file;
		var id = req.params.award_id;

		Award.findById(id).exec(function(err, award) {
			if (err) return next(err);

			award.status = post.status;
			award.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			award.works = post.works.filter(function(work) { return work != 'none'; });

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& award.setPropertyLocalised('title', post[locale].title, locale);

			});

			award.save(function(err, award) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};