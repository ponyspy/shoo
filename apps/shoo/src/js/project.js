$(function() {

	$('.swiper-container').each(function() {
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

});