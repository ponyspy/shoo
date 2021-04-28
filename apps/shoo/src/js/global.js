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
			$('.search_block').removeClass('show');
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

	$(document).on('touchmove', 'body.menu_open', false);

	$('.menu_item, .type_main, .type_category').on('click', function(e) {
		e.preventDefault();

		$('.menu_drop').removeClass('open');
		$('body, .header_block').removeClass('menu_open');

		window.location.href = $(this).attr('href');
	});

	$(document)
		.on('init_images', function(e) {
			$('.project_images').each(function() {
				var $this = $(this);

				$this.find('.project_image').first().addClass('active');
				$this.data('stack', $this.find('.project_image'));
			});
		}).trigger('init_images')
		.on('slidestep', '.project_image', function(e) {
			var $this = $(this);
			var $stack = $this.parent('.project_images').data('stack');

			$stack.length > 1 && $this.next().length !== 0
				? $stack.removeClass('active').filter(this).next().addClass('active')
				: $stack.removeClass('active').first().addClass('active');
		})
		.on('mouseenter mouseleave', '.project_item.images', function(e) {
			$(this).find('.project_poster').toggleClass('hide');
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
});