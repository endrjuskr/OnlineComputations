function showGraph() {
    $("#graph").show();
    $("#centralityMenu").show();
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