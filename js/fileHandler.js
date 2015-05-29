$(document).ready(function () {
    $("#fileLoader").change(function (evt) {
        handleFileSelect(evt);
    });
    hideGraph();
});

function uploadFile() {
    $("#fileLoader").click();
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];

    if (!file.name.match('(.*).csv')) {
        console.log("niepoprawny rodzaj pliku");
        return;
    }

    //initialize file reader
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            var graphData = processData(e.target.result);
            globalGraph = new GraphMgr(graphData);
            globalGraph.draw(document.getElementById("graph"));
            showGraph();
            hideFileLoader();
        };
    })(file);
    reader.readAsText(file);
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var lines = new Array();
    var edge;
    var nodes = new Array();
    var nodesCount = parseInt(allTextLines[0]);
    for (var i = 1; i <= nodesCount; ++i) {
        var weight = parseInt(allTextLines[i]);
        nodes.push([i.toString(), weight]);
    }
    var edgesCount = parseInt(allTextLines[nodesCount + 1]);
    for (var i = nodesCount + 2; i <= nodesCount + edgesCount + 1; ++i) {
        edge = allTextLines[i].split(',');
        lines.push([edge[0].trim(), edge[1].trim()]);
    }

    var paramList = new Array();
    for (var i = nodesCount + edgesCount + 2; i < allTextLines.length; ++i) {
        param = allTextLines[i].split(',');
        paramList[param[0]] = param[1];
    }

    var nodesDataJson = getNodesDataAsJSON(nodes);
    var edgesDataJson = getEdgesDataAsJSON(lines);

    return {graph: {nodes: nodesDataJson, edges: edgesDataJson}, params: paramList};
}

function getNodesDataAsJSON(nodes) {
    var nodesDataJSON = [];
    for (var j = 0; j < nodes.length; ++j) {
        nodesDataJSON.push({data: {id: nodes[j][0], weight: nodes[j][1]}});
    }

    return nodesDataJSON;
}

function getEdgesDataAsJSON(lines) {
    var edgesDataJSON = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        edgesDataJSON.push({data: {id: "e" + i.toString(), source: line[0], target: line[1]}});
    }
    return edgesDataJSON;
}