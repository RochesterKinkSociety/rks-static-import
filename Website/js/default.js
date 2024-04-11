var ical = {};
var lines = "";

var decodeEntities = (function() {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    // regular expression matching HTML entities
    var entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;

    return function decodeHTMLEntities(str) {
        // find and replace all the html entities
        str = str.replace(entity, function(m) {
            element.innerHTML = m;
            return element.textContent;
        });

        // reset the value
        element.textContent = '';

        return str;
    }
})();

function parseDescription(text){
	// break the textblock into an array of lines
	lines = text.split('\n');

	//Remove the FetLife fields
	var i = lines.length;
	while (i--) {
		if (lines[i].indexOf("Cost:") != -1 || lines[i].indexOf("Location:") != -1 || lines[i].indexOf("Dress Code:") != -1) {
			lines.splice(i,1);
		}
	}
	// join the array back into a single string
	text = lines.join('\n');
	text = text.replace(/\n\s*\n/g, '<br><br>');
	text = text.replace(/\\(.)/mg, "$1");
	return text;
}

$.get( "calendar.ics", function( data ) {
	ical = $.icalendar.parse(data);

	//If something went wrong, we may not have any vevents to loop over
	if (!ical || !ical.vevent || !ical.vevent.length) {
		return false;
	}

	//Filter out the meetings
	var events = ical.vevent.filter(function (event) {
		return event.categories != "Meeting";
	});

	//We should show a maximum of 6 events or less
	var show_events = events.length > 6 ? 6 : events.length;

	//Loop over the maximum number of events
	for (var i = 0; i < show_events; i++) {
		var ical_event = {
				start: new Date(ical.vevent[i].dtstart._value), 
				end: new Date(ical.vevent[i].dtend._value), 
				title: events[i].summary, 
				description: decodeEntities(events[i].description.replace(/\\(.)/mg, "$1")), 
				location: events[i].location}; 
		var div = $('<div class="col-lg-4 event"></div>');
		div.append('<h2>' + events[i].summary + '</h2>');
		var ical_span = $('<p></p>').icalendar($.extend({compact: true}, ical_event));
		div.append('<p class="event-description">' + parseDescription(events[i].description) + '</p>');
		div.append(ical_span);
		$("#events-outline").append(div);
	}
});