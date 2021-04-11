$(function() {

	$('.gallery-block').each(function() {
		var $this = $(this);

		var gallery = new Swiper($this.find('.swiper-container')[0], {
			spaceBetween: 40,
			autoHeight: true,
			slidesPerView: 1,
			loop: true,
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

		gallery.once('lazyImageReady', function(swiper) {
			setTimeout(function() {
				$(swiper.wrapper).height($(swiper.slides).eq(swiper.activeIndex).height());
			}, 300);
		});

	});

	var $images = $('.image').one('load', function(e) {
		$(this).parent('.image_item').addClass('loaded');
	});

	var $document = $(document).on('scroll', function(e) {

		$images.each(function() {
			var $this = $(this);
			var height = $(window).height();

			if ($document.scrollTop() + height + ($document.width() / height < 1 ? 100 : -100) > $this.offset().top) {
				$this.attr('src', $this.attr('data-src'));

				if ($images.length - 1 > 0) {
					$images = $images.not(this);
				} else {
					$document.off('scroll');
				}
			}
		});
	});

});