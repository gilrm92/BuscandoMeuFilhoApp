var _controlHub;
var _signalrConnection;

$(document).ready(function () {
    connect();
    setTimeout(function () { _controlHub.invoke("GetParentsOnWay"); }, 1000)
});

function connect() {
    var checkersServerURL = "http://localhost:61301/";
    var checkersHubURL = checkersServerURL + "signalRServer";

    _signalrConnection = $.hubConnection(checkersHubURL, {
        useDefaultPath: false
    });

    _controlHub = _signalrConnection.createHubProxy('ControlHub');

    _controlHub.on("getParentsOnWayCallback", function (parentsOnWay) {
        displayOnTable(parentsOnWay);
    });

    _signalrConnection.start().done(function () { _controlHub.invoke("RegisterSchoolConnection"); });
}

function displayOnTable(parentsOnway) {
    if (parentsOnway == null || parentsOnway.length == 0)
    {
        setNonParentsComming();
        return;
    }

    $('#noParents').hide();

    $('table#students tr#parent').remove();
    for (var i = 0; i < parentsOnway.length; i++) {
        var tr = $("<tr id='parent'></tr>");

        var tdStudensName = $('<td>' + parentsOnway[i].StudentName + '</td>');
        tr.append(tdStudensName);

        var tdParentName = $('<td>' + parentsOnway[i].Name + '</td>');
        tr.append(tdParentName);

        var tdDistance = $('<td>' + parentsOnway[i].Distance + '</td>');
        tr.append(tdDistance);

        $('#students').append(tr);
    }

    $('#divParentsOnWay').show();
}

function setNonParentsComming()
{
    $('#noParents').show();
    $('#divParentsOnWay').hide();
}