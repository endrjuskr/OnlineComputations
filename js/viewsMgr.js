function showGraph() {
    $("#graph").show();
    $("#centralityMenu").show();
    $("#resultTable").html("");
    $(".row").show();
}

function hideGraph() {
    $("#graph").hide();
    $("#centralityMenu").hide();
    $(".row").hide();
}

function hideFileLoader() {
    $("#fileLoaderButton").hide();
}

function showFileLoader() {
    $("#fileLoader").val("");
    $("#fileLoaderButton").show();
    hideGraph();
}