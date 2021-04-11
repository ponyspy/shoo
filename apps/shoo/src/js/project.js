$(function() {

	$('.swiper-container').each(function() {
		var $this = $(this);

		var gallery = new Swiper(this, {
			spaceBetween: 40,
			autoHeight: true,
			slidesPerView: 1,
			// loop: true,
			navigation: {
				nextEl: $this.find('.swiper-button-next')[0],
				prevEl: $this.find('.swiper-button-prev')[0],
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