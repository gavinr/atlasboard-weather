widget = {
	//runs when we receive data from the job
	onData: function(el, data) {

		//The parameters our job passed through are in the data object
		//el is our widget element, so our actions should all be relative to that
		if (data.title) {
			$('h2', el).text(data.title + ' (' + data.hourlyContent.city.name + ')');
		}

		// http://openweathermap.org/forecast5
		var mainContent = $('.content', el).html('');
		if (data.hourlyContent && data.hourlyContent.list && data.hourlyContent.list.length > 0) {
			// create table
			var table = $('<table></table>').appendTo(mainContent);
			var tr = $('<tr></tr>').appendTo(table);
			data.hourlyContent.list.forEach(function(weatherItem) {
				// create table cells:
				var itemTd = $('<td></td>').appendTo(tr);
				var hourlyTable = $('<table class="hourlyTable"></table>').appendTo(itemTd);

				var utcTime = new Date(weatherItem.dt_txt.replace(' ', 'T'));
				var hour = utcTime.getHours();
				var ampm = 'am';
				if(utcTime.getHours() > 12) {
					hour = hour - 12;
					ampm = 'pm';
				}
				var td1 = $('<tr></tr>').append('<td>' + hour + ampm + '</td>').appendTo(hourlyTable);

				var td2 = $('<tr></tr>').append('<td><img src="http://openweathermap.org/img/w/' + weatherItem.weather[0].icon + '.png" /></td>').appendTo(hourlyTable);
				var td3 = $('<tr></tr>').append('<td>' + weatherItem.weather[0].main + '</td>').appendTo(hourlyTable);
			});
		}


		// daily
		var dailyWrapper = $('<div class="dailyWrapper"></div>').appendTo(mainContent);

		if(data.dailyContent && data.dailyContent.list && data.dailyContent.list.length > 0) {
			var table = $('<table class="dailyTable"></table>').appendTo(dailyWrapper);
			data.dailyContent.list.forEach(function(weatherItem) {
				var tr = $('<tr></tr>').appendTo(table);

				// date/day:
				var utcTime = new Date(weatherItem.dt * 1000);
				var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				var td1 = $('<td>' + days[utcTime.getDay()] + '</td>').appendTo(tr);

				var td2 = $('<td><img src="http://openweathermap.org/img/w/' + weatherItem.weather[0].icon + '.png" title="' + weatherItem.weather[0].main +'" /></td>').appendTo(tr);
				var rainText = '';
				if (weatherItem.hasOwnProperty('rain')) {
					rainText = '(' + String(Math.round(weatherItem.rain)) + '%)';
				}
				var td3 = $('<td class="rainText">' + rainText + '</td>').appendTo(tr);
				var td3 = $('<td class="maxTemp">' + Math.round(parseInt(weatherItem.temp.max), 10) + '&deg;</td>').appendTo(tr);
				var td3 = $('<td class="minTemp">' +Math.round(parseInt( weatherItem.temp.min), 10) + '&deg;</td>').appendTo(tr);
			});
		}
	}
};