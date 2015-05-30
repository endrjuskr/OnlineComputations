function calculateResults() {
    var k = $("#kParam").val();
    var graph = globalGraph.graphData;
    var result = new Array();
    var degree = calculateDegree(graph.graph);
    var algorithm1 = calculateCentralityAlgorithm1(graph.graph);
    var algorithm2 = calculateCentralityAlgorithm2(graph.graph, k);
    var degreeResult = new Array();
    var algorithm1Result = new Array();
    var algorithm2Result = new Array();
    for (var i = 0; i < graph.graph.nodes.length; ++i) {
        var node = graph.graph.nodes[i].data.id;
        algorithm1Result.push({
            key: node,
            value: algorithm1[node]
        });
        degreeResult.push({
            key: node,
            value: degree[node]
        });
        algorithm2Result.push({
            key: node,
            value: algorithm2[node]
        });
    }
    result.push({
        title: "Degree",
        values: degreeResult
    });

    result.push({
        title: "Algorithm 1",
        values: algorithm1Result
    });

    result.push({
        title: "Algorithm 2 (k = " + k + ")",
        values: algorithm2Result
    });

    generateResultTable(result , 0);
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
        sv[node.data.id] = 1 / (1 + degree[node.data.id]);
        for (var j = 0; j < neighbours[node.data.id].length; ++j) {
            var neighbour = neighbours[node.data.id][j];
            sv[node.data.id] += 1 / (1 + degree[neighbour]);
        }
    }
    return sv;
}

function calculateCentralityAlgorithm2(graph, k) {
    var degree = calculateDegree(graph);
    var neighbours = calculateNeighbours(graph);
    var sv = new Array();
    for (var i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i];
        sv[node.data.id] = Math.min(1, k / (1 + degree[node.data.id]));
        for (var j = 0; j < neighbours[node.data.id].length; ++j) {
            var neighbour = neighbours[node.data.id][j];
            sv[node.data.id] += Math.max(0, (degree[neighbour] - k + 1) / (degree[neighbour] * (1 + degree[neighbour])));
        }
    }
    return sv;

}

function sort(elem) {
    generateResultTable(ResultJSON, elem);
}

var ResultJSON;

function generateResultTable(resultDataJSON, sortElem) {
    ResultJSON = resultDataJSON;
    var results = new Array();
    for (var i = 0; i < resultDataJSON[0].values.length; ++i) {
        var point = resultDataJSON[0].values[i];

        var values = new Array();
        values.push(point.key);
        for (var j = 0; j < resultDataJSON.length; ++j) {
            var value = resultDataJSON[j].values[i];
            values.push(value.value);
        }
        results.push(values);
    }

    results.sort(function(a, b) {
        return a[sortElem] - b[sortElem];
    });

    var tableHTML = "";
    tableHTML += "<table class=\"table table-striped\">";
    tableHTML += "<thead><tr><th>Node<span class='glyphicon glyphicon-arrow-down sort' aria-hidden='true' onclick='sort(0)'></span></th>";
    for (var i = 0; i < resultDataJSON.length; ++i) {
        var centralityMethod = resultDataJSON[i];
        tableHTML += "<th>" + centralityMethod.title + "<span class='glyphicon glyphicon-arrow-down sort' aria-hidden='true' onclick='sort(" + (i + 1) + ")'></span></th>";
    }

    tableHTML += "</tr></thead>";
    tableHTML += "<tbody>";
    for (var i = 0; i < results.length; ++i) {
        var point = results[i];
        tableHTML += "<tr><td>" + point[0] + "</td>";

        for (var j = 1; j < point.length; ++j) {
            var value = point[j];
            tableHTML += "<td>" + value + "</td>";
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</tbody>";
    tableHTML += "</table>";

    $("#resultTable").html(tableHTML);
}