var _listOfDisableds = [];
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

    _controlHub.on("deliveryConfirmationCallback", function (confirmation, parentName) {
        if (confirmation) {
            alert('Aluno entregue!');
        }
        else {
            alert('Ops! O responsável informou que ainda está a caminho para buscar a criança!');
        }
        //Removing from list
        _listOfDisableds = jQuery.grep(_listOfDisableds, function (value) {
            return value != parentName;
        });
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

        var disabled = "";
        if ($.inArray(parentsOnway[i].Name, _listOfDisableds) != -1)
        {
            disabled = "disabled='disabled'";
        }

        var tdButton = $('<td> <input type="button" ' + disabled + ' id="' + parentsOnway[i].Name + '" value="Entregar aluno" onclick="deliveryStudent(\'' + parentsOnway[i].Name + '\')" /> </td>');
        console.log(tdButton);
        tr.append(tdButton);

        $('#students').append(tr);
    }

    $('#divParentsOnWay').show();
}

function setNonParentsComming()
{
    $('#noParents').show();
    $('#divParentsOnWay').hide();
}

function deliveryStudent(parentName)
{
    $('#' + parentName).prop('disabled', true);
    _listOfDisableds.push(parentName);
    _controlHub.invoke("DeliveryStudentToParent", parentName);
}