$(document).ready(function () {

    $("#fileLoader").change(function (evt) {
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
            var graphData = processData(e.target.result);
            draw(graphData, document.getElementById("graph"));
        };
    })(file);
    reader.readAsText(file);
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; ++i)
        lines.push(allTextLines[i].split(', '));
    var nodesDataJson = getNodesDataAsJSON(lines);
    var edgesDataJson = getEdgesDataAsJSON(lines);

    return {nodes: nodesDataJson, edges: edgesDataJson};
}

function getNodesDataAsJSON(lines) {
    var nodesData = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        if (nodesData.indexOf(line[0]) < 0)
            nodesData.push(line[0]);
        if (nodesData.indexOf(line[1]) < 0)
            nodesData.push(line[1]);
    }

    var nodesDataJSON = [];
    for (var j = 0; j < nodesData.length; ++j)
        nodesDataJSON.push({data: {id: nodesData[j]}})

    return nodesDataJSON;
}

function getEdgesDataAsJSON(lines) {
    var edgesDataJSON = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        edgesDataJSON.push({data: {id: i.toString(), source: line[0], target: line[1]}});
    }
    return edgesDataJSON;
}