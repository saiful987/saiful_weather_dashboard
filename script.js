var url="";
var APIkey="";
var happyurl ="";
var rightNowurl = "";
var cityVibe=""; 
var bigCities = document.getElementById("searched_cities_container");

var allCities = []; 
init(); 
listClicker(); 
searchClicker(); 

function init(){
    var openCities = JSON.parse(localStorage.getItem("cities"));

    if (openCities !== null){
        cities = openCities
    }   
    
    renderButtons(); 
}

function storeCities(){
    localStorage.setItem("cities", JSON.stringify(allCities)); 
}

function renderButtons(){
    bigCities.innerHTML = ""; 
    if(allCities == null){
        return;
    }
    var manyCitiesF = [...new Set(cities)];
    for(let i=0; i < manyCitiesF.length; i++){
        var cityName = manyCitiesF[i]; 

        var happyButton = document.createElement("button");
        happyButton.textContent = cityName; 
        happyButton.setAttribute("class", "listbtn"); 

        bigCities.appendChild(happyButton);
        listClicker();
      }
    }

function listClicker(){
$(".listbtn").on("click", function(event){
    console.log("How many days do you want?")
    event.preventDefault();
    console.log("I will let you know my days fam!");
    cityVibe = $(this).text().trim();
    APIcalls(); 
})
}

function searchClicker() {
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    cityVibe = $(this).prev().val().trim()
    
    allCities.push(cityVibe);
 
    if(allCities.length > 8){
        allCities.shift()
    }

    if (cityVibe == ""){
        return; 
    }
    APIcalls();
    storeCities(); 
    renderButtons();
  })
}

function APIcalls(){
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    rightNowurl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=7e99d2ced95163596696b626f563b723";
    happyurl = url + cityVibe + APIkey;
    current_weather_url = rightNowurl + cityVibe + APIkey; 
    
    $("#name_of_city").text("Today's Weather in " + cityVibe);
    $.ajax({
        url: happyurl,
        method: "GET",
        
    }).then(function(response){
        var day_number = 0; 
        
  
        for(let i=0; i< response.list.length; i++){
            
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
       
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year); 
                var temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + day_number + "five_day_temp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + day_number + "five_day_humidity").text("Humidity: " + response.list[i].main.humidity);
                $("#" + day_number + "five_day_icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                console.log(response.list[i].dt_txt.split("-"));
                console.log(day_number);
                console.log(response.list[i].main.temp);
                day_number++; 
          }   
        }
    });


    
     $.ajax({
         url:current_weather_url,
         method: "GET", 
     }).then(function(current_data){
         console.log(current_data);
         var temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32))
         console.log("The temperature in " + cityVibe + " is: " + temp);
         $("#today_temp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#today_humidity").text("Humidity: " + current_data.main.humidity);
         $("#today_wind_speed").text("Wind Speed: " + current_data.wind.speed);
         $("#today_icon_div").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
     })    
}