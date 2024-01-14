let part = 'minutely';

function searchWeather2(lat, lon) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${appId}&units=${units}`)
        .then((result) => {
            return result.json();
        }).then((res) => {
            init2(res);
        });

}

function setPositionForWeatherBtn() {
    let prBtn = document.getElementsByClassName('predictionBtn');
    let prBtnWidth = prBtn[0].clientWidth;
    let weatherContainerHeight = weatherContainer.clientHeight;

    prBtn[0].style.left = `calc(50% - ${(prBtnWidth / 2)}px)`;
    prBtn[0].style.top = `calc(53% + ${weatherContainerHeight / 2}px)`;
    prBtn[0].style.visibility = 'visible';
    prBtn[0].innerHTML = 'show prediction';

}

function setOtherItem(value) {
    let setotherV = 'visible'
    let setotherH = 'hidden'
    let pridictionContainer = document.getElementById('pridictionContainer');
    let pridictionContainerWidth = pridictionContainer.clientWidth;

    let weatherContainer = document.getElementById('weatherContainer');
    let weatherContainerHeight = weatherContainer.clientHeight;

    pridictionContainer.style.top = `calc(53% + ${(weatherContainerHeight / 1.5) + 400}px)`;
    

    let prBtn = document.getElementsByClassName('predictionBtn'); 
    prBtn[0].innerHTML = 'hide prediction';

    let hourlyContainer = document.getElementById('hourlyContainer');
    let hourlyContainerWidth = hourlyContainer.clientWidth;
    hourlyContainer.style.top = `calc(53% + ${weatherContainerHeight / 1.5}px)`;
    

    let scrollbarBtn = document.getElementById('scrollbar');
    scrollbarBtn.style.top = `calc(53% + ${(weatherContainerHeight / 1.5)+515}px)`;
    
    if(value == 0){
        pridictionContainer.style.visibility = setotherV;
        hourlyContainer.style.visibility = setotherV;
        scrollbarBtn.style.visibility = setotherV;
    }else{
        pridictionContainer.style.visibility = setotherH;
        hourlyContainer.style.visibility = setotherH;
        scrollbarBtn.style.visibility = setotherH;
    }
}

function init2(resultFromServer) {

    setOtherItem(0)
    console.log(resultFromServer);

    const dayTemp = new Array();
    const timeofday = new Array();
    const daymin = new Array();
    const daymax = new Array();
    const dayHumidity = new Array();
    const daywind_speed = new Array();
    const dayDesc = new Array();
    const dayIcon = new Array();

    console.log('day prediction \n')
    for (var i = 0; i <= 7; i++) {
        let time = resultFromServer.daily[i].dt
        let temp = resultFromServer.daily[i].temp.day
        let max = resultFromServer.daily[i].temp.max
        let min = resultFromServer.daily[i].temp.min
        let humidity = resultFromServer.daily[i].humidity
        let wind = resultFromServer.daily[i].wind_speed
        let desc = resultFromServer.daily[i].weather[0].main
        let Icon = 'http://openweathermap.org/img/w/' + resultFromServer.daily[i].weather[0].icon + '.png';

        var mytime = convert(time,1)

        timeofday.push(mytime);
        dayTemp.push(temp);
        daymin.push(min)
        daymax.push(max)
        dayHumidity.push(humidity);
        daywind_speed.push(wind);
        dayDesc.push(desc);
        dayIcon.push(Icon);

        console.log('date: ' + time + ' temp: ' + temp + ' ' + max + '/' + min + ' \n')
    }

    showDaily(timeofday, dayTemp, daymin, daymax, dayHumidity, daywind_speed, dayDesc, dayIcon)

    const hourTemp = new Array();
    const timeofHr = new Array();
    const hourHumidity = new Array();
    const hourwind_speed = new Array();

    console.log('\nhourly prediction \n')
    for (var i = 0; i < 24; i++) {
        let time = resultFromServer.hourly[i].dt
        let temp = resultFromServer.hourly[i].temp
        let humidity = resultFromServer.hourly[i].humidity
        let wind = resultFromServer.hourly[i].wind_speed

        var mytime = convert(time,0)

        timeofHr.push(mytime);
        hourTemp.push(temp);
        hourHumidity.push(humidity);
        hourwind_speed.push(wind);

        console.log('date: ' + time + ' temp: ' + temp + '\n')
    }

    showHourly(timeofHr, hourTemp, hourHumidity, hourwind_speed)

}

function showHourly(timeofHr, hourTemp, hourHumidity, hourwind_speed) {

    console.log(timeofHr)
    console.log(hourTemp)

    new Chart("myChart", {
        type: "line",
        data: {
            labels: timeofHr,
            datasets: [{
                label: "temprature",
                data: hourTemp,
                borderColor: "red",
                fill: false
            }, {
                label: "humidity",
                data: hourHumidity,
                borderColor: "green",
                fill: false
            }, {
                label: "wind speed",
                data: hourwind_speed,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            legend: { display: true },
            plugins: {
                title: {
                    display: true,
                    text: 'Custom Chart Title',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    });

}

function showDaily(timeofday, dayTemp, daymin, daymax, dayHumidity, daywind_speed, dayDesc, dayIcon){

    for(var i=0 ;i<=7;i++){
        let temp = document.getElementsByClassName("ptemperature")[i];
        let description = document.getElementsByClassName("pDescriptionHeader")[i];
        let time = document.getElementsByClassName("timeOfP")[i];
        let Icon = document.getElementsByClassName("pIconImg")[i];

        temp.innerHTML = '<h2>'+Math.floor(dayTemp[i]*10)/10 + '&#176;' + 'c'+'</h2>'
        description.innerHTML = dayDesc[i]
        time.innerHTML = timeofday[i]
        Icon.src = dayIcon[i]
    }

}

function convert(mydt,j) {

    var dt = new Date(mydt * 1000)

    const month = dt.getMonth()+1;
    const date = dt.getDate();
    const hr = dt.getHours();
    var hr2 = (hr % 12) || 12;
    const m = dt.getMinutes();
    const AmOrPm = hr >= 12 ? 'pm' : 'am';
    
    if( j == 0){
        return hr2+':'+m+' '+ AmOrPm
    }else{
        return date+'/'+month
    }
    
  }
