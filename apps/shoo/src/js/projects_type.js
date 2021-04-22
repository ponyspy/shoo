var $window = $(window);
var $document = $(document);

$window.on('load hashchange', function(e) {
	var context = {
		skip: 0,
		limit: 8,
		category: window.location.hash.replace('#', '')
	};

	var scrollLoader = function(e, fire) {
		if (fire || $window.scrollTop() + $window.height() + 240 >= $document.height()) {
			context.limit = 4;

			$window.off('scroll');

			$.ajax({url: '', method: 'POST', data: { 'context': context }, async: false }).done(function(data) {
				if (data !== 'end') {

					$('.projects_columns').append(data);

					context.skip += 4;
					$window.on('scroll', scrollLoader);
				} else {
					$('.projects_loader').addClass('hide');
				}
			});
		}
	};

	$('.projects_loader').removeClass('hide');

	$.ajax({url: '', method: 'POST', data: { 'context': context }, async: false }).done(function(data) {
		if (data !== 'end') {
			var $data = $(data);

			$('.projects_columns').empty().append($data);
			context.skip = $data.length;
			$window.off('scroll').scrollTop(0).on('scroll', scrollLoader);
		}
	});
});

$(function() {
	$('.projects_loader').on('click', function(e) {
		$window.trigger('scroll', true);
	});

	$('.type_main.active').on('click', function(e) {
		e.preventDefault();

		var hash = $(this).attr('href').split('#')[1];

		window.location.hash = (!hash ? '#' : '#' + hash);
	});
});