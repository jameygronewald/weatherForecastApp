$(document).ready(function() {
    // INITIALIZE GLOBAL VARIABLES


    // FUNCTIONS


    // FUNCTION CALLS


    // EVENT LISTENERS
    $('#searchButton').on('click', function(event) {
        event.preventDefault();
        let searchInput = $('#citySearch');
        let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=207015d3d9ea763c8fa74acf5fe16ce5';
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
        });
    });


});