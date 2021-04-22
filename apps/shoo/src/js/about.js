$(function() {
	$('.menu_block a').on('click', function(e) {
		e.preventDefault();

		$('.menu_drop').toggleClass('open');
		$('body, .header_block').toggleClass('menu_open');

		var hash = $(this).attr('href').split('#')[1];

		if (!hash) {
			window.location.href = $(this).attr('href')
		} else {
			window.location.hash = '#' + hash;
		}

	});
});