$(function() {
	$('.project_category').on('click', function(e) {
		var category = $(this).text();
		var $categorys = $('.project_item').filter(function(i) { return $(this).find('.project_category').text() == category; });

		if (!$(this).hasClass('active')) {
			$('.project_category, .project_type, .project_build').removeClass('active');

			$('.project_item').filter($categorys).find('.project_category').addClass('active');
			$('.project_item').addClass('hide').filter($categorys).removeClass('hide');
		} else {
			$('.project_category, .project_type, .project_build').removeClass('active');

			$('.project_item').removeClass('hide');
		}
	});

	$('.project_type').on('click', function(e) {
		var type = $(this).text();
		var $type_items = $('.project_item').filter(function(i) { return $(this).find('.project_type').text() == type; });

		if (!$(this).hasClass('active')) {
			$('.project_category, .project_type, .project_build').removeClass('active');

			$('.project_item').filter($type_items).find('.project_type').addClass('active');
			$('.project_item').addClass('hide').filter($type_items).removeClass('hide');
		}
		else {
			$('.project_category, .project_type, .project_build').removeClass('active');

			$('.project_item').removeClass('hide');
		}
	});

	$('.project_build').on('click', function(e) {
		var build = $(this).text();
		var $build_items = $('.project_item').filter(function(i) { return $(this).find('.project_build').text() == build; });

		if (!$(this).hasClass('active')) {
			$('.project_category, .project_type, .project_build').removeClass('active');

			$('.project_item').filter($build_items).find('.project_build').addClass('active');
			$('.project_item').addClass('hide').filter($build_items).removeClass('hide');
		}
		else {
			$('.project_category, .project_type, .project_build').removeClass('active');

			$('.project_item').removeClass('hide');
		}
	});

});