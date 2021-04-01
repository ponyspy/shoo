var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Award = Model.Award;
	var Work = Model.Work;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		Work.find().exec(function(err, works) {
			if (err) return next(err);

			res.render('admin/awards/add.pug', {works: works});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var file = req.file;

		var award = new Award();

		award._short_id = shortid.generate();
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

			res.redirect('/admin/awards');
		});
	};


	return module;
};