$(document).ready(function () {

    $("#files").change(function (evt) {
        handleFileSelect(evt);
    });

});

function handleFileSelect(evt) {
    var file = evt.target.files[0];

    if (!file.type.match('(.*)/csv')) {
        console.log("niepoprawny rodzaj pliku");
        return;
    }

    //initialize file reader
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            $("#list").html('<ul>' + e.target.result + '</ul>');
        };
    })(file);
    reader.readAsText(file);
}