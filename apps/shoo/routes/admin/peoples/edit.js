var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var People = Model.People;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.people_id;

		People.findById(id).exec(function(err, people) {
			if (err) return next(err);

			res.render('admin/peoples/edit.pug', { people: people });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.people_id;

		People.findById(id).exec(function(err, people) {
			if (err) return next(err);

			people.status = post.status;
			people.type = post.type;
			people.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'name'])
					&& people.setPropertyLocalised('name', post[locale].name, locale);

			});

			people.save(function(err, people) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};