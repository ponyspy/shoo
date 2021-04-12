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
		autoplay: {
			delay: 5000,
			disableOnInteraction: true
		},
	});

});