let appId = 'debed5c0c527b5f714a04604236fafa4';

let units = 'metric';
let searchMethod;

let locationIcon = document.getElementById('locationIcon');
let longitute;
let letitute;

function getSearchMethod(searchTerm) {
    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q';
}

function searchWeather(searchTerm) {    
    getSearchMethod(searchTerm);
    fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`)
        .then((result) => {
            return result.json();
        }).then((res) => {
            init(res);
        });
}

function init(resultFromServer) {
    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = "url('img/clearPicture.jpg')";
            break;

        case 'Clouds':
            document.body.style.backgroundImage = "url('img/cloudyPicture.jpg')";
            break;

        case 'Rain':
        case 'Drizzle':
            document.body.style.backgroundImage = "url('img/rainPicture.jpg')";
            break;

        case 'Haze':
        case 'Mist':
            document.body.style.backgroundImage = "url('img/mistPicture.jpg')";
            break;

        case 'Thunderstorm':
            document.body.style.backgroundImage = "url('img/stormPicture.jpg')";
            break;

        case 'Snow':
            document.body.style.backgroundImage = "url('img/snowPicture.jpg')";
            break;

        default :
            document.body.style.backgroundImage = "url('img/default.jpg')";
            break;
    }

    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let timezone = document.getElementById('timezone');
    let temperatureElement = document.getElementById('temperature');
    let tempmin = document.getElementById('minmax');
    let humidityElement = document.getElementById('humidity');
    let windSpeedElement = document.getElementById('windSpeed');
    let cityHeader = document.getElementById('cityHeader');
    let country = document.getElementById('country');
    
    let weatherIcon = document.getElementById('documentIconImg');

    weatherIcon.src = 'http://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png';

    let resultDescription = resultFromServer.weather[0].description;
    let epoch_time = resultFromServer.dt;
    weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
    temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp * 10)/10 + '&#176;' + 'c';
    tempmin.innerHTML = 'low: ' + Math.round(resultFromServer.main.temp_min * 10)/10+ '&#176;' + 'c | high: ' + Math.round(resultFromServer.main.temp_max * 10)/10 + '&#176;' + 'c';
    windSpeedElement.innerHTML = '<b>Wind Speed: </b>' + Math.floor(resultFromServer.wind.speed) + ' meter/s';
    cityHeader.innerHTML = resultFromServer.name;
    country.innerHTML = ' | ' + resultFromServer.sys.country;
    humidityElement.innerHTML = '<b>Humidity levels: </b>' + resultFromServer.main.humidity + '%';

    letitute = resultFromServer.coord.lat;
    longitute = resultFromServer.coord.lon;

    locationIcon.src = 'img/earth.ico';
    var myDate = new Date(epoch_time*1000);
    console.log(myDate)

    let finaldate = convertDT(myDate)

    timezone.innerHTML = finaldate
    
    setPositionForWeatherInfo();
    setPositionForWeatherBtn();
}
function convertDT(dt) {
    const month = dt.getMonth()+1;
    const date = dt.getDate();
    const hr = dt.getHours();
    var hr2 = (hr % 12) || 12;
    const m = dt.getMinutes();
    const AmOrPm = hr >= 12 ? 'pm' : 'am';
    
    return month+'/'+date+', '+hr2+':'+m+' '+ AmOrPm
  }

function showCordOnMap(lat, lon){
    console.log(`call map for \n${lat} and ${lon}`);
    document.getElementById('Gmap').style.visibility = 'visible';

    let weatherMap= document.getElementById('Gmap');
    let backBtn = document.getElementById('backButton');

    let weatherContainer = document.getElementById('weatherContainer');
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;

    weatherMap.style.width = `${weatherContainerWidth}px`;
    weatherMap.style.height = `${weatherContainerHeight}px`;

    weatherMap.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
    weatherMap.style.top = `calc(60% - ${weatherContainerHeight / 1.3}px)`;

    backBtn.style.visibility = 'visible';
    backBtn.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
    backBtn.style.top = `calc(55% - ${(weatherContainerHeight / 1.3)}px)`;

    document.getElementById('weatherContainer').style.visibility = 'hidden';
    initMap(lat, lon);

    backBtn.addEventListener('click', ()=>{
        document.getElementById('Gmap').style.visibility = 'hidden';
        document.getElementById('weatherContainer').style.visibility = 'visible';
        backBtn.style.visibility = 'hidden';
    })
}



function showPrediction(lat, lon){
    console.log(`show prediction for \n${lat} and ${lon}`);
    searchWeather2(lat, lon);
}

function setPositionForWeatherInfo() {
    let weatherContainer = document.getElementById('weatherContainer');
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;

    weatherContainer.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
    weatherContainer.style.top = `calc(60% - ${weatherContainerHeight / 1.3}px)`;
    weatherContainer.style.visibility = 'visible';
}

let prtoggle = 0;
document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if (searchTerm){
        searchWeather(searchTerm);
        document.getElementById('Gmap').style.visibility = 'hidden';
        document.getElementById('backButton').style.visibility = 'hidden';
        setOtherItem(1)
        prtoggle = 0
        document.getElementById('searchInput').placeholder  = 'Search for a City...';
    }
    else
        document.getElementById('searchInput').placeholder  = 'required...';
});

document.getElementById('searchInput').addEventListener('keyup', (e)=>{
    var keey = e.keyCode;
    if ( keey === 'Enter' || keey === 13 ) {
        e.preventDefault();
        document.getElementById("searchBtn").click();
    }
});

locationIcon.addEventListener('click', function(){
    if( letitute != '' && longitute != '')
        showCordOnMap(letitute, longitute);
    else
        console.log('no data here');
});

document.getElementsByClassName('predictionBtn')[0].addEventListener('click',()=>{
    if( prtoggle == 0 ){
        if( letitute != '' && longitute != ''){
            showPrediction(letitute, longitute);
            prtoggle = 1;
        }
        else
            console.log('no data here');  
    }else{
        setOtherItem(1)
        prtoggle = 0;
        document.getElementsByClassName('predictionBtn')[0].innerHTML = 'show prediction';
    }
    
})

function initMap(lat, lng) {

    const myLatLng = { lat: lat ,lng: lng };
    const map = new google.maps.Map(document.getElementById("Gmap"), {
      zoom: 8,
      center: myLatLng,
    });
  
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
  }
  
  window.initMap = initMap;