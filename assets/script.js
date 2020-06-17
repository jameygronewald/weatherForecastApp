$(document).ready(function() {
    // INITIALIZE GLOBAL VARIABLES


    // FUNCTIONS


    // FUNCTION CALLS


    // EVENT LISTENERS
    $('#searchButton').on('click', function(event) {
        event.preventDefault();
        $('#currentDayRow').empty();
        let searchInput = $('#citySearch').val();
        let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + searchInput + '&APPID=207015d3d9ea763c8fa74acf5fe16ce5';
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
            let latitude = response.coord.lat;
            let longitude = response.coord.lon;
            let tempFarenheit = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
            $('#currentDayRow').append($('<h3>').text(response.name));
            $('#currentDayRow').append($('<p>').text('Temperature: ' + tempFarenheit + '°F'));
            $('#currentDayRow').append($('<p>').text('Humidity: ' + response.main.humidity + '%'));
            $('#currentDayRow').append($('<p>').text('Wind Speed: ' + response.wind.speed + 'MPH'));
            let queryURL_UV = 'http://api.openweathermap.org/data/2.5/uvi?APPID=207015d3d9ea763c8fa74acf5fe16ce5&lat=' + latitude + '&lon=' + longitude;
            $.ajax({
                url: queryURL_UV,
                method: 'GET'
            }).then(function(response) {
                console.log(response);
                $('#currentDayRow').append($('<p>').text('UV Index: ' + response.value));

            });
            let queryURLDaily = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=current,minutely,hourly&appid=207015d3d9ea763c8fa74acf5fe16ce5'
            $.ajax({
                url: queryURLDaily,
                method: 'GET'
            }).then(function(response) {
                console.log(response);
                let i = 0;
                while (i < 5) {
                    let dailyTempFarenheit = ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(1);
                    $('.cardRow').append($('<div class="card col-md-2"><div class="card-body"><h5 class="card-title" id = "day' + i + '"></h5><p class="card-text cardTemp"id = "day' + i + 'Temp"></p><p class="card-text cardHumidity" id = "day' + i + 'Humidity"></p></div></div>'));
                    $('#day' + i + 'Temp').text('Temperature: ' + dailyTempFarenheit + '°F');
                    $('#day' + i + 'Humidity').text('Humidity: ' + response.daily[i].humidity + '%');
                    i++;
                };
            });
        });
    });


});