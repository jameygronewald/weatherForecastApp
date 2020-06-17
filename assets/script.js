$(document).ready(function() {
    // INITIALIZE GLOBAL VARIABLES


    // FUNCTIONS


    // FUNCTION CALLS


    // EVENT LISTENERS
    $('#searchButton').on('click', function(event) {
        event.preventDefault();
        $('#currentDayRow').empty();
        let searchInput = $('#citySearch').val();
        console.log(searchInput);
        let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + searchInput + '&APPID=207015d3d9ea763c8fa74acf5fe16ce5';
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
            let latitude = response.coord.lat;
            let longitude = response.coord.lon;
            let tempFarenheit = (response.main.temp - 273.15) * 1.8 + 32;
            $('#currentDayRow').append($('<h3>').text(response.name));
            $('#currentDayRow').append($('<p>').text('Temperature: ' + tempFarenheit.toFixed(1) + '°F'));
            $('#currentDayRow').append($('<p>').text('Humidity: ' + response.main.humidity + '%'));
            $('#currentDayRow').append($('<p>').text('Wind Speed: ' + response.wind.speed + 'MPH'));
            let queryURL_UV = 'http://api.openweathermap.org/data/2.5/uvi?APPID=207015d3d9ea763c8fa74acf5fe16ce5&lat=' + latitude + '&lon=' + longitude;
            $.ajax({
                url: queryURL_UV,
                method: 'GET'
            }).then(function(response) {
                console.log(response.value);
                $('#currentDayRow').append($('<p>').text('UV Index: ' + response.value));

            })
        });
        
    });


});