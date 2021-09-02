$(function() {

	$(document).on('mouseup touchend', 'body.stop_scroll', function(e) {
		if ($(e.target).closest('.swiper-preview').length) return;

		$('.project_preview').removeClass('show');
		$('body').removeClass('stop_scroll');
	});


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
		autoHeight: true,
		slidesPerView: 1,
		loop: true,
		navigation: {
			nextEl: $('.swiper-preview').find('.arrow-right')[0],
			prevEl: $('.swiper-preview').find('.arrow-left')[0],
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

});