var fs = require('fs');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Project = Model.Project;
	var People = Model.People;
	var Publication = Model.Publication;

	module.index = function(req, res, next) {
		Project.find({'main': {'$exists': true}}).where('status').ne('hidden').sort('-build_date').populate('category').exec(function(err, projects) {
			if (err) return next(err);

			res.render('main/index.pug', {projects: projects});
		});
	};

	module.about = function(req, res, next) {

		async.parallel({
			images: function(callback) {
				fs.readdir(__glob_root + '/public/cdn/about', function(err, files) {
					callback(null, files);
				});
			},
			philosophy: function(callback) {
				fs.readFile(__app_root + '/static/philosophy_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			how_work: function(callback) {
				fs.readFile(__app_root + '/static/how_work_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			our_service: function(callback) {
				fs.readFile(__app_root + '/static/our_service_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			clients: function(callback) {
				fs.readFile(__app_root + '/static/clients_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			our_team: function(callback) {
				fs.readFile(__app_root + '/static/our_team_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			vacancies: function(callback) {
				fs.readFile(__app_root + '/static/vacancies_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			peoples: function(callback) {
				People.find().where('status').nin(['hidden', 'special']).sort('-date').exec(callback);
			},
		}, function(err, results) {
			if (err) return next(err);

			res.render('main/about.pug', results);
		});
	};

	return module;
};