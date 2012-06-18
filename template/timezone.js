function phpbb_switch_tz_date(keep_selection)
{
	$('#timezone > optgroup').css("display", "none");
	$("#timezone > optgroup[label='" + $('#tz_date').val() + "']").css("display", "block");

	if ($("#timezone > optgroup[label='" + $('#tz_date').val() + "'] > option").size() == 1)
	{
		// If there is only one timezone for the selected date, we just select that automatically.
		$("#timezone > optgroup[label='" + $('#tz_date').val() + "'] > option:first").attr("selected", true);
		keep_selection = true;
	}

	if (typeof keep_selection !== 'undefined')
	{
		if (!keep_selection)
		{
			$('#timezone > option:first').attr("selected", true);
		}
	}
}

function phpbb_enable_tz_dates()
{
	$('#tz_select_date').css("display", "block");
}

function phpbb_preselect_tz_select(force_selector, l_suggestion)
{

	// The offset returned here is in minutes and negated.
	// http://www.w3schools.com/jsref/jsref_getTimezoneOffset.asp
	var offset = (new Date()).getTimezoneOffset();
	if (offset < 0)
	{
		var sign = '+';
		offset = -offset;
	}
	else
	{
		var sign = '-';
	}
	var minutes = offset % 60;
	var hours = (offset - minutes) / 60;
	if (hours < 10)
	{
		hours = '0' + hours.toString();
	}
	else
	{
		hours = hours.toString();
	}
	if (minutes < 10)
	{
		minutes = '0' + minutes.toString();
	}
	else
	{
		minutes = minutes.toString();
	}

	var prefix = 'GMT' + sign + hours + ':' + minutes;
	var prefix_length = prefix.length;

	var selector_options = $('#tz_date > option');
	for (var i = 0; i < selector_options.length; ++i)
	{
		var option = selector_options[i];
		if (option.value.substring(0, prefix_length) == prefix)
		{
			if ($('#tz_date').val() != option.value && !force_selector)
			{
				// We do not select the option for the user, but notify him,
				// that we would suggest a different setting.
				$('#tz_select_date_suggest').css("display", "inline");
				$('#tz_select_date_suggest').attr("title", l_suggestion.replace("%s", option.innerHTML));
				$('#tz_select_date_suggest').html(l_suggestion.replace("%s", option.innerHTML.substring(0, 9)));
				phpbb_switch_tz_date(true);
			}
			else
			{
				// Firefox scrolls the selector only to put the option into view;
				// for negative-offset timezones, this means the first timezone
				// of a particular offset will be the bottom one, and selected,
				// with all other timezones not visible. Not much can be done
				// about that here unfortunately.
				option.selected = true;
				phpbb_switch_tz_date(!force_selector);
				$('#tz_select_date_suggest').css("display", "none");
			}
			break;
		}
	}
}

phpbb_enable_tz_dates();
phpbb_preselect_tz_select(is_registration, l_timezone_date_suggestion);
