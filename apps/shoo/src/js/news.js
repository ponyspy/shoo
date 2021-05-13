var $window = $(window);
var $document = $(document);


$(function() {
	var context = {
		skip: 0,
		limit: 8,
	};

	var scrollLoader = function(e, fire) {
		if (fire || $window.scrollTop() + $window.height() + 240 >= $document.height()) {
			context.limit = 4;

			$window.off('scroll');

			$.ajax({url: '', method: 'POST', data: { 'context': context }, async: false }).done(function(data) {
				if (data !== 'end') {

					var $data = $(data);

					if ($data.length < 4) {
						$('.projects_loader').addClass('hide');
					}

					$('.news_block').append($data);

					context.skip += 4;
					$window.on('scroll', scrollLoader);
				} else {
					$('.news_loader').addClass('hide');
				}
			});
		}
	};

	$window.on('scroll', scrollLoader).trigger('scroll', true);

	$('.news_loader').on('click', function(e) {
		$window.trigger('scroll', true);
	});

});