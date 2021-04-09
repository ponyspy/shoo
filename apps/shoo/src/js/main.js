$(function() {
	var deltaX = 0;
	var deltaY = 0;
	var step = 150;

	$('.project_images').each(function() {
		var $this = $(this);

		$this.children('.project_image').first().addClass('active');
		$this.data('stack', $this.children('.project_image'));
	});

	$('.project_item').not('.hover')
		.on('mouseenter', function(e) {
			$(this).children('.project_poster').addClass('hide');
		})
		.on('mouseleave', function(e) {
			$(this).children('.project_poster').removeClass('hide');
		});

	$('.project_image')
		.on('slidestep', function(e) {
			var $this = $(this);
			var $stack = $this.parent('.project_images').data('stack');

			if ($stack.length > 1 && $this.next().length !== 0) {
				$stack.removeClass('active').filter(this).next().addClass('active');
			} else {
				$stack.removeClass('active').first().addClass('active');
			}
		})
		.on('mousemove', function(e) {
			if (e.pageX >= deltaX || e.pageY >= deltaY) {
				$(this).trigger('slidestep');

				deltaX = e.pageX + step;
				deltaY = e.pageY + step;
			} else if (e.pageX <= deltaX - step * 2 || e.pageY <= deltaY - step * 2) {
				deltaX = e.pageX + step;
				deltaY = e.pageY + step;

				$(this).trigger('slidestep');
			}
		});

	var swMain = new Swiper('.swiper-container', {
		init: false,
		slidesPerView: 1,
		spaceBetween: 0,
		// centeredSlides: true,
		// autoHeight: true,
		loop: true,
		speed: 500,
		keyboard: {
			enabled: true
		},
		// autoplay: {
		// 	delay: 5000,
		// 	disableOnInteraction: true
		// },
		// pagination: {
		// 	el: '.swiper-pagination',
		// 	type: 'bullets',
		// 	clickable: true
		// },
	});

	swMain.on('init slideChange', function(e) {
		$('.slider_body').find('.project_columns').removeClass('active').eq(swMain.realIndex).addClass('active');
	});

	swMain.init();

});