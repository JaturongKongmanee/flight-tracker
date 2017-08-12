let flightList = [];

function loadFlightData(flight) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayFlightInfo(this);
        }
    };
    xmlhttp.open('GET', `https://api.flightradar24.com/common/v1/flight/list.json?query=${flight}&fetchBy=flight&page=1&limit=100&token=&timestamp=`, true);
    xmlhttp.send();
};

function setUpFlightToGetData() {
        //const flightList = ['ca979', 'zh9003'];
        flightList.forEach( x => loadFlightData(x));
        console.log(flightList);
};

function getCurrentDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;

    return `${dd}-${mm}-${yyyy}`;
};

function formatTime(tms) {
    const date = new Date(tms*1000);           
    const hours = date.getHours(); // Hours part from the timestamp       
    const minutes = "0" + date.getMinutes(); // Minutes part from the timestamp        
    const seconds = "0" + date.getSeconds(); // Seconds part from the timestamp

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2); // Will display time in 10:30:23 format
};

function displayFlightInfo(data) {
    const t = JSON.parse(data.response);
    //console.log(t);
    const finalResult = t.result.response.data[t.result.response.data.length - 1];

    const flightProperties = {
        currentDate: getCurrentDate(),
        originName: finalResult.airport.origin.position.country.name,
        destinationName: finalResult.airport.destination.position.country.name,
        aircraftModel: finalResult.aircraft.model.text,
        timestamp: formatTime(t.result.response.timestamp),
        sta: 'sta',
        atd: 'atd',
        status:'status',
    };

    const mainTable = document.querySelector('#main-table');
    const flightCode = t.result.request.query.toLowerCase();
    const flightSectionId = document.querySelector(`#${flightCode}`);
    const flightObjKeys = Object.keys(flightProperties);

    //console.log(mainTable.children.length);

    if (flightSectionId !== null) {
        for (let i = 0; i < 8; i++) {
            flightSectionId.children[i].innerHTML = flightProperties[flightObjKeys[i]]
        }
    } else {
        //console.log(`new row ${mainTable.children[0].children.length}`);
        const row = mainTable.insertRow(mainTable.children[0].children.length);
        row.setAttribute('id', `${flightCode}`);
        for (let i = 0; i < 8; i++) {
            row.insertCell(i).innerHTML = flightProperties[flightObjKeys[i]]
        }
    }
};

//setInterval(setUpFlightToGetData, 10000);

const searchInput = document.querySelector('.search');

searchInput.addEventListener('keyup', function(e) {
    const inputFlight = e.target.value.toLowerCase();
    if (e.keyCode === 13 && !flightList.includes(inputFlight)) {
        document.querySelector('.output').innerHTML = `${e.keyCode} ${e.target.value}`;
        flightList.push(inputFlight);
        setUpFlightToGetData();
        searchInput.value = '';
        searchInput.style.placeholder = 'Flight no. ...';
    }
});