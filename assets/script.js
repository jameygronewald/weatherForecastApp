$(document).ready(function () {
  // INITIALIZE GLOBAL VARIABLES
  const today = moment().format('MMMM Do YYYY');
  const day1 = moment().add(1, 'days').format('MMMM Do YYYY');
  const day2 = moment().add(2, 'days').format('MMMM Do YYYY');
  const day3 = moment().add(3, 'days').format('MMMM Do YYYY');
  const day4 = moment().add(4, 'days').format('MMMM Do YYYY');
  const day5 = moment().add(5, 'days').format('MMMM Do YYYY');

  let cityButtonArray = [];
  const savedButtons = JSON.parse(localStorage.getItem('buttons')) || null;
  if (savedButtons) cityButtonArray = [...savedButtons];

  // FUNCTIONS

  const getWeatherData = city => {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=207015d3d9ea763c8fa74acf5fe16ce5`;

    $.ajax({ url: queryURL, method: 'GET' }).then(response => {
      if (response === null || response === undefined) {
        return alert('Invalid search. Please search a valid city name.');
      }
      if (cityButtonArray.includes(response.name) === false) {
        addCityButton(response.name);
      }

      const latitude = response.coord.lat;
      const longitude = response.coord.lon;
      const tempFarenheit = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(
        1
      );
      $('#currentDayRow').empty();
      $('#currentDayRow').append(
        $('<h3>')
          .text(`${response.name} (${today})`)
          .append(
            `<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="${response.weather[0].description}">`
          )
      );
      $('#currentDayRow').append(
        $('<p>').text(`Temperature: ${tempFarenheit}°F`)
      );
      $('#currentDayRow').append(
        $('<p>').text(`Humidity: ${response.main.humidity}%`)
      );
      $('#currentDayRow').append(
        $('<p>').text(`Wind Speed: ${response.wind.speed}MPH`)
      );

      getCurrentUVData(latitude, longitude);

      getFiveDayForecast(latitude, longitude);
    });
  };

  const getCurrentUVData = (lat, long) => {
    const queryURL_UV = `https://api.openweathermap.org/data/2.5/uvi?APPID=207015d3d9ea763c8fa74acf5fe16ce5&lat=${lat}&lon=${long}`;

    $.ajax({ url: queryURL_UV, method: 'GET' }).then(response => {
      const UVIndex = response.value;
      const UVIndexColor = $(`<span>${UVIndex}</span>`);

      if (UVIndex < 3) {
        UVIndexColor.addClass('moderate');
      } else if (UVIndex < 7) {
        UVIndexColor.addClass('warning');
      } else {
        UVIndexColor.addClass('danger');
      }

      $('#currentDayRow').append(
        $('<p>').text('UV Index: ').append(UVIndexColor)
      );
    });
  };

  const getFiveDayForecast = (lat, long) => {
    const queryURLDaily = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=current,minutely,hourly&appid=207015d3d9ea763c8fa74acf5fe16ce5`;

    $.ajax({ url: queryURLDaily, method: 'GET' }).then(response => {
      $('.cardRow').empty();
      $('.cardRow').append('<h3 class="col-md-12">5-Day Forecast:</h3>');

      const forecastDays = [day1, day2, day3, day4, day5];
      forecastDays.forEach((day, i) => {
        const dailyTempFarenheit = (
          (response.daily[i].temp.day - 273.15) * 1.8 +
          32
        ).toFixed(1);

        $('.cardRow').append(
          $(
            `<div class="card col-xl-2 bg-primary text-white"><div class="card-body"><h5 class="card-title" id="day${i}"></h5><img src="https://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png" alt="${response.daily[i].weather[0].description}"><p class="card-text cardTemp" id="day${i}Temp"></p><p class="card-text cardHumidity" id="day${i}Humidity"></p></div></div>`
          )
        );

        $(`#day${i}`).text(day);
        $(`#day${i}Temp`).text(`Temperature: ${dailyTempFarenheit}°F`);
        $(`#day${i}Humidity`).text(`Humidity: ${response.daily[i].humidity}%`);
      });
    });
  };

  const addCityButton = cityName => {
    const cityButton = $('<button>')
      .attr('class', 'col-sm-11 btn btn-light cityButton')
      .attr('data-city', cityName)
      .text(cityName);

    $('.cityButtons').append(cityButton);
    if (cityButtonArray.includes(cityName) === false) {
      cityButtonArray.push(cityName);
      localStorage.setItem('buttons', JSON.stringify(cityButtonArray));
    }
  };

  // Method to run on page load
  cityButtonArray.forEach(city => addCityButton(city));

  // Event Listeners

  $('#searchButton').click(event => {
    event.preventDefault();
    $('#currentDayRow').empty();

    const searchInput = $('#citySearch').val();
    getWeatherData(searchInput);
  });

  $('.cityButtons').click(event => {
    event.preventDefault();

    const searchInput = $(event.target).attr('data-city');
    getWeatherData(searchInput);
  });
});
