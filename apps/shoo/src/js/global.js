$(function() {
	var deltaX = 0;
	var deltaY = 0;
	var step = 150;

	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', { text: result }).done(function(data) {
				$('.search_results').empty().append(data);
				$(document).trigger('init_images');
			});
		}
	};

	$('.search_input')
		.on('keyup change', function(event) {
			search.val = $(this).val();
		})
		.on('focusin', function(event) {
			search.interval = setInterval(function() {
				search.checkResult.call(search);
			}, 600);
		})
		.on('focusout', function(event) {
			clearInterval(search.interval);
		});

	$('.menu_drop').on('click', function(e){
		if ($('.search_block').hasClass('show')) {
			$('.menu_block').removeClass('hide');
			$('.search_block').removeClass('show').find('.search_results').empty();
			$('.search_input').val('');
		} else {
			$(this).toggleClass('open');
			$('body, .header_block').toggleClass('menu_open');
		}
	});

	$('.search_open').on('click', function(e) {
		$('.menu_block').addClass('hide');
		$('.search_block').addClass('show');
		$('.search_input').focus();
	});

	$(document)
		.on('touchmove', 'body.stop_scroll', false)
		.on('keyup', function(e) {
			if (e.which == 27 && $('.header_block').hasClass('menu_open')) {
				$('.menu_drop').trigger('click');
			}
		});

	$('.menu_item, .type_main, .type_category').on('click', function(e) {
		e.preventDefault();

		$('.menu_drop').removeClass('open');
		$('body, .header_block').removeClass('menu_open');

		window.location.href = $(this).attr('href');
	});

	$(document)
		.on('slidestep', '.project_image', function(e) {
			var $posters = $(this).parent().find('.project_image');

			var flag_round = $(this).index() < $posters.length - 1;
			var $next_load = flag_round
				? $posters.filter(this).nextAll()
				: $posters.first().nextAll().addBack();

			$next_load.slice(0, 2).not('.load').each(function() {
				var $this = $(this);
				$this.css('background-image', 'url(' + $this.attr('data-src') + ')').addClass('load').removeAttr('data-src');
			});

			flag_round
				? $posters.removeClass('active').filter(this).next().addClass('active')
				: $posters.removeClass('active').first().addClass('active');

		})

		.on('init_images', function(e) {
			$('.project_images').each(function() {
				$(this).find('.project_image').last().trigger('slidestep');
			});
		}).trigger('init_images')


		.on('mouseleave', '.project_item.images', function(e) {
			setTimeout(function() {
				$(this).find('.project_image').removeClass('active').last().trigger('slidestep');
			}, 300);
		})

		.on('mousemove', '.project_image', function(e) {
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

		$('.type_item:has(.type_category)')
			.on('mouseenter', function(e) {
				$('.content_block').addClass('hover');
			})
			.on('mouseleave', function(e) {
				$('.content_block').removeClass('hover');
			});

});

