module.exports = function(Model) {
	var module = {};

	var Publication = Model.Publication;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Publication.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			res.send('ok');
		});

	};


	return module;
};