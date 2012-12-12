(function($) {  // Avoid conflicts with other libraries

"use strict";

// This callback will mark all forum icons read
phpbb.add_ajax_callback('mark_forums_read', function(res) {
	var read_title = res.NO_UNREAD_POSTS;
	var unread_title = res.UNREAD_POSTS;

	$('li.row dl.forum_unread').each(function(e) {
		$(this).removeClass('forum_unread').addClass('forum_read');
		$(this).children('dt[title=' + unread_title + ']').attr('title', read_title);
	});

	$('li.row dl.forum_unread_subforum').each(function(e) {
		$(this).removeClass('forum_unread_subforum').addClass('forum_read_subforum');
		$(this).children('dt[title=' + unread_title + ']').attr('title', read_title);
	});

	$('li.row dl.forum_unread_locked').each(function(e) {
		$(this).removeClass('forum_unread_locked').addClass('forum_read_locked');
		$(this).children('dt[title=' + unread_title + ']').attr('title', read_title);
	});
});

// This callback will mark all topic icons read
phpbb.add_ajax_callback('mark_topics_read', function(res) {
	var i,j;
	var read_title = res.NO_UNREAD_POSTS;
	var unread_title = res.UNREAD_POSTS;
	var icons_array = [
		['global_unread', 'global_read'],
		['announce_unread', 'announce_read'],
		['sticky_unread', 'sticky_read'],
		['topic_unread', 'topic_read']
	];

	var icons_state = ['', '_hot', '_hot_mine', '_locked', '_locked_mine', '_mine'];

	// Make sure all icons are marked as read
	for (i = 0; i < icons_array.length; i++)
	{
		for (j = 0; j < icons_state.length; j++)
		{
			$('li.row dl.' + icons_array[i][0] + icons_state[j]).each(function(e) {
				$(this).removeClass(icons_array[i][0] + icons_state[j]).addClass(icons_array[i][1] + icons_state[j]);
				$(this).children('dt[title=' + unread_title + ']').attr('title', read_title);
			});
		}
	}

	// Remove link to first unread post
	$('span.icon_topic_newest').each(function(e) {
		$(this).remove();
	});
});

// This callback finds the post from the delete link, and removes it.
phpbb.add_ajax_callback('post_delete', function() {
	var el = $(this),
		post_id;

	if (el.attr('data-refresh') === undefined)
	{
		post_id = el[0].href.split('&p=')[1];
		var post = el.parents('#p' + post_id).css('pointer-events', 'none');
		if (post.hasClass('bg1') || post.hasClass('bg2'))
		{
			var posts1 = post.nextAll('.bg1');
			post.nextAll('.bg2').removeClass('bg2').addClass('bg1');
			posts1.removeClass('bg1').addClass('bg2');
		}
		post.fadeOut(function() {
			$(this).remove();
		});
	}
});

// This callback removes the approve / disapprove div or link.
phpbb.add_ajax_callback('post_approve', function(res) {
	var remove = (res.approved) ? $(this) : $(this).parents('.post');
	$(remove).css('pointer-events', 'none').fadeOut(function() {
		$(this).remove();
	});
});

// This removes the parent row of the link or form that fired the callback.
phpbb.add_ajax_callback('row_delete', function() {
	$(this).parents('tr').remove();
});

// This handles friend / foe additions removals.
phpbb.add_ajax_callback('zebra', function(res) {
	var zebra;

	if (res.success) {
		zebra = $('.zebra');
		zebra.first().html(res.MESSAGE_TEXT);
		zebra.not(':first').html('&nbsp;').prev().html('&nbsp;');
	}
});



$('[data-ajax]').each(function() {
	var $this = $(this),
		ajax = $this.attr('data-ajax'),
		fn;

	if (ajax !== 'false')
	{
		fn = (ajax !== 'true') ? ajax : null;
		phpbb.ajaxify({
			selector: this,
			refresh: $this.attr('data-refresh') !== undefined,
			callback: fn
		});
	}
});


/**
 * This simply appends #preview to the action of the
 * QR action when you click the Full Editor & Preview button
 */
$('#qr_full_editor').click(function() {
	$('#qr_postform').attr('action', function(i, val) {
		return val + '#preview';
	});
});



/**
 * This AJAXifies the quick-mod tools. The reason it cannot be a standard
 * callback / data attribute is that it requires filtering - some of the options
 * can be ajaxified, while others cannot.
 */
phpbb.ajaxify({
	selector: '#quickmodform',
	refresh: true,
	filter: function (data) {
		var action = $('#quick-mod-select').val();

		if (action === 'make_normal')
		{
			return $(this).find('select option[value="make_global"]').length > 0;
		}
		else if (action === 'lock' || action === 'unlock')
		{
			return true;
		}

		if (action === 'delete_topic' || action === 'make_sticky' || action === 'make_announce' || action === 'make_global') {
			return true;
		}

		return false;
	}
});

$('#quick-mod-select').change(function () {
	$('#quickmodform').submit();
});



})(jQuery); // Avoid conflicts with other libraries
