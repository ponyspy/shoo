var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://0.0.0.0/' +  __app_name, {
	// useCreateIndex: true,
	// useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: {type: Date, default: Date.now},
});

var projectSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	intro: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	build_date: { type: Date, default: Date.now },
	area: { type: String, trim: true, locale: true },
	level: { type: String, trim: true, locale: true },
	location: { type: String, trim: true, locale: true },
	brands: { type: String, trim: true, locale: true },
	poster: { type: String },
	logo: { type: String },
	status: String,
	main: String,
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	type: 'String', // design, architecture
	category: { type: ObjectId, ref: 'Category' },
	peoples: [{ type: ObjectId, ref: 'People' }],
	images: [{
		size: String,
		gallery: Boolean,
		main: Boolean,
		description: { type: String, trim: true, locale: true },
		original: { type: String },
		thumb: { type: String },
		preview: { type: String }
	}],
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var publicationSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	link: String,
	poster: { type: String },
	projects: [{ type: ObjectId, ref: 'Project' }],
	type: String,
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var newsSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	intro: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	poster: { type: String },
	status: String,
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var peopleSchema = new Schema({
	name: { type: String, trim: true, locale: true },
	type: String,
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var categorySchema = new Schema({
	title: { type: String, trim: true, locale: true },
	sym: { type: String, trim: true, index: true, sparse: true },
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});


// ------------------------
// *** Index Block ***
// ------------------------


projectSchema.index({'date': -1});
projectSchema.index({'category': 1});
projectSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
publicationSchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
newsSchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
peopleSchema.index({'name.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
categorySchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

projectSchema.plugin(mongooseLocale);
publicationSchema.plugin(mongooseLocale);
newsSchema.plugin(mongooseLocale);
peopleSchema.plugin(mongooseLocale);
categorySchema.plugin(mongooseLocale);


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Project = mongoose.model('Project', projectSchema);
module.exports.Publication = mongoose.model('Publication', publicationSchema);
module.exports.News = mongoose.model('News', newsSchema);
module.exports.People = mongoose.model('People', peopleSchema);
module.exports.Category = mongoose.model('Category', categorySchema);

