$(document).ready(function() {
    // INITIALIZE GLOBAL VARIABLES
    let today = moment().format('MMMM Do YYYY');
    let day1 = moment().add(1, 'days').format('MMMM Do YYYY');
    let day2 = moment().add(2, 'days').format('MMMM Do YYYY');
    let day3 = moment().add(3, 'days').format('MMMM Do YYYY');
    let day4 = moment().add(4, 'days').format('MMMM Do YYYY');
    let day5 = moment().add(5, 'days').format('MMMM Do YYYY');
    // FUNCTIONS


    // FUNCTION CALLS


    // EVENT LISTENERS
    $('#searchButton').on('click', function(event) {
        event.preventDefault();
        $('#currentDayRow').empty();
        let searchInput = $('#citySearch').val();
        let cityButton = $('<button>').attr('class', 'col-sm-11 btn btn-light').attr('data-city', searchInput).text(searchInput);
        $('.cityButtons').append(cityButton);
        $(cityButton).on('click', function(event) {
            event.preventDefault();
            searchInput = $(cityButton).attr('data-city').val();
            console.log(searchInput);
        });
        let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + searchInput + '&APPID=207015d3d9ea763c8fa74acf5fe16ce5';
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
            let latitude = response.coord.lat;
            let longitude = response.coord.lon;
            let tempFarenheit = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
            $('#currentDayRow').append($('<h3>').text(response.name + ' (' + today + ')'));
            $('#currentDayRow').append($('<p>').text('Temperature: ' + tempFarenheit + '°F'));
            $('#currentDayRow').append($('<p>').text('Humidity: ' + response.main.humidity + '%'));
            $('#currentDayRow').append($('<p>').text('Wind Speed: ' + response.wind.speed + 'MPH'));
            let queryURL_UV = 'http://api.openweathermap.org/data/2.5/uvi?APPID=207015d3d9ea763c8fa74acf5fe16ce5&lat=' + latitude + '&lon=' + longitude;
            $.ajax({
                url: queryURL_UV,
                method: 'GET'
            }).then(function(response) {
                console.log(response);
                let UVIndex = response.value;
                let UVIndexColor = $('<span>' + UVIndex + '</span>')
                if (UVIndex < 3) {
                    UVIndexColor.addClass('moderate');
                }
                else if (UVIndex < 7) {
                    UVIndexColor.addClass('warning');
                }
                else {
                    UVIndexColor.addClass('danger');
                }
                $('#currentDayRow').append($('<p>').text('UV Index: ').append(UVIndexColor));
            });
            let queryURLDaily = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=current,minutely,hourly&appid=207015d3d9ea763c8fa74acf5fe16ce5'
            $.ajax({
                url: queryURLDaily,
                method: 'GET'
            }).then(function(response) {
                console.log(response);
                $('.cardRow').empty();
                $('.cardRow').append('<h3 class = "col-md-12">5-Day Forecast:</h3>')
                let i = 1;
                while (i < 6) {
                    let forecastDays = [
                        day1,
                        day2,
                        day3,
                        day4,
                        day5
                    ]
                    let dailyTempFarenheit = ((response.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(1);
                    $('.cardRow').append($('<div class="card col-md-2.4 bg-primary text-white"><div class="card-body"><h5 class="card-title" id = "day' + i + '"></h5><p class="card-text cardTemp"id = "day' + i + 'Temp"></p><p class="card-text cardHumidity" id = "day' + i + 'Humidity"></p></div></div>'));
                    $('#day' + i).text(forecastDays[i-1]);
                    $('#day' + i + 'Temp').text('Temperature: ' + dailyTempFarenheit + '°F');
                    $('#day' + i + 'Humidity').text('Humidity: ' + response.daily[i].humidity + '%');
                    i++;
                };
            });
        });
    });
});