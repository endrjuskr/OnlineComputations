function showGraph() {
    $("#graph").show();
    $("#centralityMenu").show();
    $("#resultTable").html("");
}

function hideGraph() {
    $("#graph").hide();
    $("#centralityMenu").hide();
}

function hideFileLoader() {
    $("#fileLoader").hide();
}

function showFileLoader() {
    $("#fileLoader").val("");
    $("#fileLoader").show();
    hideGraph();
}