//Global Variables
const APIKey = "88cd3e743334fef42eba6fda6b091e21";
let cityName;
let cityArray = [];
var today = moment().format("MM/DD/YYYY");
cityName = localStorage.getItem("City");


currInfo();


function searchNow () {
    cityName = $(".searchCity").val();
    cityArray.push(cityName);
    localStorage.setItem("City", [cityName]);
    currInfo();
    renderButtons();
}
$(".searchBtn").click(searchNow);

function currInfo() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=Imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL, 
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $(".city").text(response.name, today);
        $(".city").append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
        $(".date").append(" " + today);
        $(".desc").text("Summary: " + response.weather[0].description)
        $(".temp").text("Temperature: " + response.main.temp + " °F");
        $(".hum").text("Humidity: " + response.main.humidity + "%");
        $(".wind").text("Wind Speed: " + response.wind.speed + " mph");
        
     function uvInfo() {
         let lat = response.coord.lat;
         let lon = response.coord.lon;

         let uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=Imperial&appid=" + APIKey;

         $.ajax({
             url: uvURL,
             method: "GET"
         }).then(function (response2) {
             console.log(response2);

             let rating = response2.current.uvi;
             $(".uv").text("UV Rating: " + rating);
             
            //  switch(true) {
            //     case ( rating <= 2 ):
            //     $(".uv").addClass("text-success");
            //     break;
            //     case ( rating <= 2 && rating < 6):
            //          $("uv").addClass("text-warning");
            //     break;
            //     case (rating >= 6 ):
            //         $(".uv").addClass("text-danger");
            //     break;
            //     }
            if (rating <= 2) {
                $(".uv").addClass("text-success");
            }
            else if (rating > 2 && rating < 6) {
                $(".uv").addClass("text-warning");
            }
            else if (rating >= 6) {
                $(".uv").addClass("text-danger");
            }


                let daily = response2.daily;
                $(".card-deck").empty();
                for (var i = 1 ; i < daily.length - 1; i++ ) {

                    var card = $("<div></div>");
                    var data = $("<h5 class='card-title'>" + moment(response2.daily[i].dt, "X").format("MM/DD/YYYY") + "</h5>");
                    var temp = $("<p class='card-text'> Temp: " + response2.daily[i].temp.day + " °F </p>");
                    var hum = $("<p class='card-text'> Humidity: " + response2.daily[i].humidity + "%</p>");
                    var main = $("<p class='card-text'>" + response2.daily[i].weather[0].main + "</p>");

                    card.addClass("card");
                    card.append(data, temp, hum, main)
                    card.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
                    card.addClass("bg-info");
                    $(".card-deck").append(card);

                }
         })
     }   
     uvInfo();



    })

}

function renderButtons() {
    let newCity = cityArray[cityArray.length - 1];
    let button = $("<a>");
    let buttonDiv = $("<div class='row border search'>");

    button.text(newCity);
    button.addClass("previous btn btn-block ");
    button.attr("role", "button");
    button.attr("data-city", newCity);
    buttonDiv.append(button);
    $("#prevSearch").prepend(buttonDiv);
    $(".searchCity").val("");

    $(".previous").on("click", function () {
        let btnCity = $(this).attr("data-city");
        cityName = btnCity;
        cityArray.push(cityName);
        localStorage.setItem("City", [cityArray]);
        currInfo();
    });
}