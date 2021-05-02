var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var mime = require('mime');

exports.edit = function(req, res) {
	async.series({
		philosophy_ru: function(callback) {
			fs.readFile(__app_root + '/static/philosophy_ru.html', 'utf8', callback);
		},
		philosophy_en: function(callback) {
			fs.readFile(__app_root + '/static/philosophy_en.html', 'utf8', callback);
		},
		how_work_ru: function(callback) {
			fs.readFile(__app_root + '/static/how_work_ru.html', 'utf8', callback);
		},
		how_work_en: function(callback) {
			fs.readFile(__app_root + '/static/how_work_en.html', 'utf8', callback);
		},
		our_service_ru: function(callback) {
			fs.readFile(__app_root + '/static/our_service_ru.html', 'utf8', callback);
		},
		our_service_en: function(callback) {
			fs.readFile(__app_root + '/static/our_service_en.html', 'utf8', callback);
		},
		clients_ru: function(callback) {
			fs.readFile(__app_root + '/static/clients_ru.html', 'utf8', callback);
		},
		clients_en: function(callback) {
			fs.readFile(__app_root + '/static/clients_en.html', 'utf8', callback);
		},
		our_team_ru: function(callback) {
			fs.readFile(__app_root + '/static/our_team_ru.html', 'utf8', callback);
		},
		our_team_en: function(callback) {
			fs.readFile(__app_root + '/static/our_team_en.html', 'utf8', callback);
		},
		vacancies_ru: function(callback) {
			fs.readFile(__app_root + '/static/vacancies_ru.html', 'utf8', callback);
		},
		vacancies_en: function(callback) {
			fs.readFile(__app_root + '/static/vacancies_en.html', 'utf8', callback);
		}
	}, function(err, results) {
		res.render('admin/about.pug', { content: results });
	});
};

exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	async.series({
		image_1: function(callback) {
			if (!files['image_1']) return callback(null);

			var file = files['image_1'][0];

			mkdirp(__glob_root + '/public/cdn/images', function() {
				fs.rename(file.path, __glob_root + '/public/cdn/images/image_1' + '.' + mime.getExtension(file.mimetype), callback);
			});
		},
		image_2: function(callback) {
			if (!files['image_2']) return callback(null);

			var file = files['image_2'][0];

			mkdirp(__glob_root + '/public/cdn/images', function() {
				fs.rename(file.path, __glob_root + '/public/cdn/images/image_2' + '.' + mime.getExtension(file.mimetype), callback);
			});
		},
		philosophy_ru: function(callback) {
			if (!post.philosophy.ru) return callback(null);

			fs.writeFile(__app_root + '/static/philosophy_ru.html', post.philosophy.ru, callback);
		},
		philosophy_en: function(callback) {
			if (!post.philosophy.en) return callback(null);

			fs.writeFile(__app_root + '/static/philosophy_en.html', post.philosophy.en, callback);
		},
		how_work_ru: function(callback) {
			if (!post.how_work.ru) return callback(null);

			fs.writeFile(__app_root + '/static/how_work_ru.html', post.how_work.ru, callback);
		},
		how_work_en: function(callback) {
			if (!post.how_work.en) return callback(null);

			fs.writeFile(__app_root + '/static/how_work_en.html', post.how_work.en, callback);
		},
		our_service_ru: function(callback) {
			if (!post.our_service.ru) return callback(null);

			fs.writeFile(__app_root + '/static/our_service_ru.html', post.our_service.ru, callback);
		},
		our_service_en: function(callback) {
			if (!post.our_service.en) return callback(null);

			fs.writeFile(__app_root + '/static/our_service_en.html', post.our_service.en, callback);
		},
		clients_ru: function(callback) {
			if (!post.clients.ru) return callback(null);

			fs.writeFile(__app_root + '/static/clients_ru.html', post.clients.ru, callback);
		},
		clients_en: function(callback) {
			if (!post.clients.en) return callback(null);

			fs.writeFile(__app_root + '/static/clients_en.html', post.clients.en, callback);
		},
		our_team_ru: function(callback) {
			if (!post.our_team.ru) return callback(null);

			fs.writeFile(__app_root + '/static/our_team_ru.html', post.our_team.ru, callback);
		},
		our_team_en: function(callback) {
			if (!post.our_team.en) return callback(null);

			fs.writeFile(__app_root + '/static/our_team_en.html', post.our_team.en, callback);
		},
		vacancies_ru: function(callback) {
			if (!post.vacancies.ru) return callback(null);

			fs.writeFile(__app_root + '/static/vacancies_ru.html', post.vacancies.ru, callback);
		},
		vacancies_en: function(callback) {
			if (!post.vacancies.en) return callback(null);

			fs.writeFile(__app_root + '/static/vacancies_en.html', post.vacancies.en, callback);
		},
	}, function(err, results) {
		res.redirect('back');
	});
};