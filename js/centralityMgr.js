function calculateResults() {
    var graph = globalGraph.graphData;
    var result = new Array();
    var degree = calculateDegree(graph);
    var algorithm1 = calculateCentralityAlgorithm1(graph);
    var degreeResult = new Array();
    var algorithm1Result = new Array();
    for (var i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i].data.id;
        algorithm1Result.push({
            key: node,
            value: algorithm1[node]
        });
        degreeResult.push({
            key: node,
            value: degree[node]
        });
    }
    result.push({
        title: "degree",
        values: degreeResult
    });

    result.push({
        title: "centrality algorithm 1",
        values: algorithm1Result
    });

    generateResultTable(result);
}

function calculateDegree(graph) {
    var degree = new Array();
    for (var i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i];
        degree[node.data.id] = 0;
    }
    for (var i = 0; i < graph.edges.length; ++i) {
        var edge = graph.edges[i];
        degree[edge.data.source] += 1;
        degree[edge.data.target] += 1;
    }
    return degree;
}

function calculateNeighbours(graph) {
    var neighbours = new Array();
    for (var i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i];
        neighbours[node.data.id] = new Array();
    }
    for (var i = 0; i < graph.edges.length; ++i) {
        var edge = graph.edges[i];
        neighbours[edge.data.source].push(edge.data.target);
        neighbours[edge.data.target].push(edge.data.source);
    }
    return neighbours;
}

function calculateCentralityAlgorithm1(graph) {
    var degree = calculateDegree(graph);
    var neighbours = calculateNeighbours(graph);
    var sv = new Array();
    for (var i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i];
        sv[node.data.id] = 1 / degree[node.data.id];
        for (var j = 0; j < neighbours[node.data.id].length; ++j) {
            var neighbour = neighbours[node.data.id][j];
            sv[node.data.id] = 1 / degree[neighbour];
        }
    }
    return sv;
}


function generateResultTable(resultDataJSON) {
    var tableHTML = "";
    tableHTML += "<table class=\"table table-striped\">";
    tableHTML += "<thead><tr><th>Node</th>";
    for (var i = 0; i < resultDataJSON.length; ++i) {
        var centralityMethod = resultDataJSON[i];
        tableHTML += "<th>" + centralityMethod.title + "</th>";
    }

    tableHTML += "</tr></thead>";
    tableHTML += "<tbody>";
    for (var i = 0; i < resultDataJSON[0].values.length; ++i) {
        var point = resultDataJSON[0].values[i];
        tableHTML += "<tr><td>" + point.key + "</td>";

        for (var j = 0; j < resultDataJSON.length; ++j) {
            var value = resultDataJSON[j].values[i];
            tableHTML += "<td>" + value.value + "</td>";
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</tbody>";
    tableHTML += "</table>";

    $("#resultTable").html(tableHTML);
}