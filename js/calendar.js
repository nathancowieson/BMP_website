function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

function getAppropriateImage(title_string) {
    let default_image = "./images/sarsen.jpg";
    title_string = title_string.toLowerCase();
    const working_group = ["working", "bee", "planting", "cleaning", "clean"];
    if (working_group.some(v => title_string.includes(v))) {
	output_string = "./images/digging.jpg";
    } else {
	output_string = "./images/sarsen.jpg";
    }
    return output_string;
}

function printCalendar () {
    var calendarId = 'c9aek21331tvrp3mtqtbf3k8m8@group.calendar.google.com';
    var apiKey = 'AIzaSyB-hTsxexMxgVuc7VnMH1n48L-1VVhTtCI';
    var userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
  if (!userTimeZone) {
      userTimeZone = 'Europe/London';
  }

  // Initializes the client with the API key and the Translate API.
    gapi.client.init({
	'apiKey': apiKey,
	'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(function () {
	return gapi.client.calendar.events.list({
	    'calendarId': calendarId,
	    'timeZone': userTimeZone,
	    'singleEvents': true,
	    'timeMin': (new Date()).toISOString(), // gathers only events not happened yet
	    'timeMax': addMonths(new Date(),4).toISOString(), //only show events so many months in future
	    'maxResults': 5,
	    'orderBy': 'startTime'
	});
    }).then(function (response) {
	if (response.result.items) {
      var getNowPlayingDiv = document.getElementById('event-list'); // Make sure your HTML has This ID!
      // Create a table with events:
	    var calendarRows = [''];
	    response.result.items.forEach(function (entry) {
		var eventDate = dayjs(entry.start.dateTime).format("YYYY-MM-DD"); // eg: 2022-03-24
		var eventDay = dayjs(entry.start.dateTime).format("DD"); // eg: 24
		var eventMonth = dayjs(entry.start.dateTime).format("MMM"); // eg: Mar
		var eventYear = dayjs(entry.start.dateTime).format("YYYY"); // eg: 2022
		var eventStartTime = dayjs(entry.start.dateTime).format("HH:mm A"); // eg: 10:00 AM
		var eventEndsAt = dayjs(entry.end.dateTime).format('LT'); // eg: 7:00 PM
		var parkLocationURL = "https://www.google.co.uk/maps/place/Betjeman+Millennium+Park/@51.5894357,-1.432529,17z";
		var eventImage = getAppropriateImage(entry.summary);
		var parkRegexps = [/betjeman/i,/park/i,/bmp/i];
		var len = parkRegexps.length,
		    i=0;
		var location = '<li style="width:50%;"><span class="fa fa-at" aria-hidden="true"></span>'+ entry.location +'</li>';
		for (; i < len; i++) {
		    if (parkRegexps[i].test(entry.location.toLowerCase())) {
			location = '<li style="width:50%;"><a href="https://www.google.co.uk/maps/place/Betjeman+Millennium+Park/@51.5894357,-1.432529,17z"><span class="fa fa-at" aria-hidden="true"></span>'+ entry.location +'</a></li>';
			break;
		    }
		}
	      
		calendarRows.push('' +
				  '<!-- ONE EVENT -->' +
				  '<li>' +
				  '<time datetime="'+ eventDate +'">' +
				  '<span class="day">'+ eventDay +'</span>' +
				  '<span class="month">'+ eventMonth +'</span>' +
				  '<span class="year">'+ eventYear +'</span>' +
				  '<span class="time">'+ eventStartTime +'</span>' +
				  '</time>' +
				  '<img alt="Park image" src='+ eventImage +'>' +
				  '<div class="info">' +
				  '<h2 class="title">'+ entry.summary +'</h2>' +
				  '<p class="desc">'+ entry.description +'</p>' +
				  '<ul>' +
				  location +
				  '<li style="width:50%;"><a href="#website"><span class="fa fa-calendar"></span>'+ eventStartTime +'</a></li>' +
				  '</ul>' +
				  '</div>' +
				  '<div class="social">' +
				  '<ul>' +
				  '<li class="facebook" style="width:33%;"><a href="https://en-gb.facebook.com/BetjemanMillenniumPark/"><span class="fa fa-facebook"></span></a></li>' +
				  '<li class="directions" style="width:33%;"><a href="https://www.google.co.uk/maps/place/Betjeman+Millennium+Park/@51.5894357,-1.432529,17z"><span class="fa fa-map-marker"></span></a></li>' +
				  '</ul>' +
				  '</div>' +
				  '</li>' +
				  '<!--  END OF EVENT -->');
	  







			    
//          '<tr class="gcal-event__tr">' +
//           '<td class="gcal-event__td-time">' +
//              '<time datetime="' + entry.start.dateTime + '" class="gcal-event__time-start">' + eventDate + '</time> - ' +
//              '<time datetime="' + entry.end.dateTime + '" class="gcal-event__time-end">' + eventEndsAt + '</time>' +
//            '</td>' +
//			  '<td class="gcal-event__td-event-name">' + entry.summary + '</td>' +
//			  '<td class="gcal-event__td-event-location">' + entry.location + '</td>' +
//          '</tr>');
	    });
	    getNowPlayingDiv.innerHTML = calendarRows.join('');
	}
    }, function (reason) {
	console.log('Error: ' + reason.result.error.message);
    });
}

// Loads the JavaScript client library and invokes `start` afterwards.
gapi.load('client', printCalendar);

