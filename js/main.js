var _controlHub;
var _signalrConnection;
var schools = [];
var checkPosition;
var _parentName = "Rodrigo Alves";
var _parentDistance = "";

$(document).ready(function () {
    prepareSchools();
    setSchools();
    connect();
});

function connect() {
    var checkersServerURL = "http://localhost:61301/";
    var checkersHubURL = checkersServerURL + "signalRServer";

    _signalrConnection = $.hubConnection(checkersHubURL, {
        useDefaultPath: false
    });

    _controlHub = _signalrConnection.createHubProxy('ControlHub');
    _signalrConnection.start();
}

function calculateDistance(posistionStart, positionEnd) {
    var distance = parseFloat(posistionStart.distanceTo(positionEnd).toPrecision(4));
    $('#infoAboutDistance').text("Distancia atual até seu filho: " + distance + " metros");
    
    _parentDistance = distance.toString();

    checkPosition = setTimeout(function () { keepCheckingPosition() } , 2000);
}


/////////////////////////////////////////////////
/////////////////////////Schools part////////////
/////////////////////////////////////////////////
function prepareSchools() {
    var schoolBR = new Object();
    schoolBR.id = 1;
    schoolBR.name = "Pedro Alves - Eleva (Shopping Tijuca)";
    schoolBR.latlng = new LatLon(Dms.parseDMS(-22.92152979652248), Dms.parseDMS(-43.235042095184326));

    schools.push(schoolBR);

    var schoolPL = new Object();
    schoolPL.id = 2;
    schoolPL.name = "Tomasz Krakovic - Eleva (Escola polonesa)";
    schoolPL.latlng = new LatLon(Dms.parseDMS(52.40251378780547), Dms.parseDMS(16.939249634742737));

    schools.push(schoolPL);
}

function setSchools() {
    $(schools).each(function (idx, item) {
        var option = $('<option />');
        option.attr('value', item.id).text(item.name);

        $('#schools').append(option);
    });
}

function chooseSchool() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var actualPosition = new LatLon(Dms.parseDMS(position.coords.latitude), Dms.parseDMS(position.coords.longitude));
            checkApproximationSchool(actualPosition);
        }, function () {
            handleError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleError(false);
    }
}

function checkApproximationSchool(positionParent) {
    var schoolId = $('#schools').find(":selected").val();
    var school = jQuery.grep(schools, function (item) {
        return (item.id == schoolId);
    });

    calculateDistance(positionParent, school[0].latlng);
    setGoogleMapsLink(positionParent, school[0].latlng);
    _controlHub.invoke("SetParentOnWay", _parentName, _parentDistance, school[0].name);

    $('#selectChild').hide();
    $('#cancel').show();
    $('#infoAboutDistance').show();
    $('#schools').prop('disabled', true);

}

function setGoogleMapsLink(latlngStart, latlngEnd)
{
    $('#externalMap').show()
    $('#externalMap').attr('href', 'http://maps.google.com/maps?saddr=' + latlngStart.lat + "," + latlngStart.lon + '&daddr= ' + latlngEnd.lat + "," + latlngEnd.lon);
}

function keepCheckingPosition()
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var actualPosition = new LatLon(Dms.parseDMS(position.coords.latitude), Dms.parseDMS(position.coords.longitude));
            checkApproximationSchool(actualPosition);
        }, function () {
            handleError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleError(false);
    }
}

function cancelChoose() {
    clearInterval(checkPosition);
    _controlHub.invoke("RemoveParentOnWay", _parentName);

    $('#externalMap').hide();
    $('#cancel').hide();
    $('#infoAboutDistance').hide();
    $('#selectChild').show();
    $('#schools').prop('disabled', false);
}