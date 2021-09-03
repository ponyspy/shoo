$(function() {

	$('.swiper-gallery').each(function() {
		var $this = $(this);

		var swGallery = new Swiper(this, {
			spaceBetween: 40,
			autoHeight: true,
			slidesPerView: 1,
			loop: true,
			navigation: {
				nextEl: $this.parent('.slider_block').find('.arrow-right')[0],
				prevEl: $this.parent('.slider_block').find('.arrow-left')[0],
			},
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 2
			},
			keyboard: {
				enabled: true
			},
		});

	});


	var swPreview = new Swiper('.swiper-preview', {
		spaceBetween: 40,
		// autoHeight: true,
		slidesPerView: 1,
		mousewheel: true,
		effect: 'fade',
		loop: true,
		navigation: {
			nextEl: $('.project_preview').find('.arrow-right')[0],
			prevEl: $('.project_preview').find('.arrow-left')[0],
		},
		preloadImages: false,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 2
		},
		keyboard: {
			enabled: true
		},
	});


	$('.toggle_full').on('click', function(e) {
		$('body').addClass('stop_scroll');

		var id = $(this).attr('data-id');
		var sw_index = $('.swiper-preview').find('.swiper-slide[data-id="' + id + '"]').attr('data-swiper-slide-index');

		$('.project_preview').addClass('show');
		swPreview.update();
		swPreview.slideTo(+sw_index + 1, 0);
	});

	$('.preview_close').on('click', function(e) {
		$('.project_preview').removeClass('show');
		$('body').removeClass('stop_scroll');
	});

	$(document).on('keyup', function(e) {
		if (e.which == 27) $('.preview_close').trigger('click');
	});

});