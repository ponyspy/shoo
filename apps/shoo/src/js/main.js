$(function() {
	var swMain = new Swiper('.swiper-container', {
		slidesPerView: 1,
		spaceBetween: 40,
		// centeredSlides: true,
		// autoHeight: true,
		loop: true,
		speed: 500,
		keyboard: {
			enabled: true
		},
		navigation: {
			nextEl: $('.slider_block').find('.arrow-right')[0],
			prevEl: $('.slider_block').find('.arrow-left')[0],
		},
		// autoplay: {
		// 	delay: 5000,
		// 	disableOnInteraction: true
		// },
	});

});