function setFileHandler() {
    $("#fileLoader").change(function (evt) {
        handleFileSelect(evt);
    });
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];

    if (!file.name.match('(.*).net')) {
        alert("We only accept PAJEK format.");
        return;
    }

    //initialize file reader
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            var graphData = processData(e.target.result);
            globalGraph = new GraphMgr(graphData);
            globalGraph.draw(hideStartContent);
            hideTooltips();
            if (window._statusManager) {
                window._statusManager.changeStep(2);
            }
        };
    })(file);
    reader.readAsText(file);
}

function processData(allText) {
    var lines = new Array();
    var nodes = new Array();

    var edges = allText.split(";");

    for(var i  = 0; i < edges.length; ++i) {
        var edge = edges[i];
        var node = edge.split(",");
        if($.inArray(node[0], nodes) == -1) {
            nodes.push([node[0], 1])
        }
        if($.inArray(node[1], nodes) == -1) {
            nodes.push([node[1], 1])
        }
        lines.push(node)
    }


    var nodesDataJson = getNodesDataAsJSON(nodes);
    var edgesDataJson = getEdgesDataAsJSON(lines);

    return {graph: {nodes: nodesDataJson, edges: edgesDataJson}};
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

function saveResultsAsCSV() {

    var textToWrite = "Node,";
    for (var i = 0; i < ResultJSON.length - 1; ++i) {
        var centralityMethod = ResultJSON[i];
        textToWrite += centralityMethod.title + ",";
    }
    // last centrality name
    textToWrite += ResultJSON[ResultJSON.length - 1].title + "\n";

    //for every node
    for (var i = 0; i < ResultJSON[0].values.length; ++i) {
        //node key
        textToWrite += ResultJSON[0].values[i].key + ",";
        //for every centrality method
        for (var j = 0; j < ResultJSON.length - 1; ++j)
            textToWrite += ResultJSON[j].values[i].value + ",";
        // last centrality value for given node
        textToWrite += ResultJSON[ResultJSON.length - 1].values[i].value + "\n";
    }

    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "result.csv";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function saveResultsAsTex() {

    var textToWrite = "\\begin{tabular}{| l ";
	for (var i = 0; i < ResultJSON.length; ++i)
		textToWrite +="| l ";
	textToWrite +="|}\n\\hline\n";
	textToWrite +="Node & ";
    for (var i = 0; i < ResultJSON.length - 1; ++i) {
        var centralityMethod = ResultJSON[i];
        textToWrite += centralityMethod.title + " & ";
    }
    textToWrite += ResultJSON[ResultJSON.length - 1].title + " \\\\\n\\hline\n";

    for (var i = 0; i < ResultJSON[0].values.length; ++i) {
        textToWrite += ResultJSON[0].values[i].key + " & ";
        for (var j = 0; j < ResultJSON.length - 1; ++j)
            textToWrite += ResultJSON[j].values[i].value + " & ";
        textToWrite += ResultJSON[ResultJSON.length - 1].values[i].value + " \\\\\n";
    }
	textToWrite += "\\hline\n\\end{tabular}\n";

    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "table.tex";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}