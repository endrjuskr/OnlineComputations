var decimal_points = 4;

function calculateResults() {
    var k = $("#kParam").val();
    var d_cutoff = $("#d_cutoffParam").val();
    var graph = globalGraph.graphData;
    var result = new Array();

    var degree = calculateDegree(graph.graph);
    var closeness = calculateCloseness(graph.graph);
    var betweenness = calculateBetweenness(graph.graph);
    var eigenvector = calculateEigenvector(graph.graph, 1000, 0.0001);
    var algorithm1 = calculateCentralityAlgorithm1(graph.graph);
    var algorithm2 = calculateCentralityAlgorithm2(graph.graph, k);
    var algorithm3 = calculateCentralityAlgorithm3(graph.graph, d_cutoff);
    var algorithm4 = calculateCentralityAlgorithm4(graph.graph, function(x) { return Math.sqrt(x); })

    debugger;

    var degreeResult = new Array();
    var closenessResult = new Array();
    var betweennessResult = new Array();
    var eigenvectorResult = new Array();
    var algorithm1Result = new Array();
    var algorithm2Result = new Array();
    var algorithm3Result = new Array();
    var algorithm4Result = new Array();

    for (var i = 0; i < graph.graph.nodes.length; ++i) {
        var node = graph.graph.nodes[i].data.id;

        degreeResult.push({
            key: node,
            value: degree[node]
        });
        closenessResult.push({
            key: node,
            value: closeness[node]
        });
        betweennessResult.push({
            key: node,
            value: betweenness.get(parseInt(node)).toFixed(decimal_points)
        });
        eigenvectorResult.push({
            key: node,
            value: eigenvector.get(parseInt(node)).toFixed(decimal_points)
        });
        algorithm1Result.push({
            key: node,
            value: algorithm1[node].toFixed(decimal_points)
        });
        algorithm2Result.push({
            key: node,
            value: algorithm2[node].toFixed(decimal_points)
        });
        algorithm3Result.push({
            key: node,
            value: algorithm3[node].toFixed(decimal_points)
        });
        algorithm4Result.push({
            key: node,
            value: algorithm4[node].toFixed(decimal_points)
        });
    }

    debugger;


    result.push({
        title: "Degree",
        values: degreeResult
    });
    result.push({
        title: "Closeness",
        values: closenessResult
    });
    result.push({
        title: "Betweenness",
        values: betweennessResult
    });
    result.push({
        title: "Eigevector Centrality",
        values: eigenvectorResult
    });
    result.push({
        title: "SV-based degree centrality",
        values: algorithm1Result
    });
    result.push({
        title: "SV-based degree<br>centrality (k = " + k + ")",
        values: algorithm2Result
    });
    result.push({
        title: "Algorithm 3<br>(d_cutoff = " + d_cutoff + ")",
        values: algorithm3Result
    });
    result.push({
        title: "Algorithm 4",
        values: algorithm4Result
    });

    generateResultTable(result , 0, true);
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

function createGraph(graph) {
    var g = new jsnx.Graph();
    g.addEdgesFrom(graph.edges.map(function(edge) {
        return [edge.data.source, edge.data.target];
    }));

    return g;    
}

function calculateCloseness(graph) {
    var g = createGraph(graph);
    var paths = jsnx.shortestPathLength(g);

    var closeness = new Array();
    graph.nodes.map(function(node) {
        var dist_sum = 0;
        var node_dists = paths.get(parseInt(node.data.id));
        graph.nodes.map(function(node2) {
            dist_sum += node_dists.get(parseInt(node2.data.id));
        });
        closeness[node.data.id] = dist_sum;
    });
    return closeness;
}

function calculateBetweenness(graph) {
    var g = createGraph(graph);
    var betweenness = jsnx.betweennessCentrality(g);
    return betweenness;
}

function calculateEigenvector(graph, max_iter, epsilon) {
    var g = createGraph(graph);
    var eigenvector = jsnx.eigenvectorCentrality(g, { maxIter: max_iter, tolerance: epsilon });
    return eigenvector;
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

function calculateCentralityAlgorithm3(graph, d_cutoff) {
    var g = createGraph(graph);
    var paths = jsnx.shortestPathLength(g);

    var ext_nghbrs = new Array();
    var ext_degree = new Array();
    graph.nodes.map(function(node) {
        var nghbrs = new Array();
        var degree = 0;
        var dist_map = paths.get(parseInt(node.data.id));
        graph.nodes.map(function(node2) {
            if (node2.data.id != node.data.id)
                if (dist_map.get(parseInt(node2.data.id)) <= d_cutoff) {
                    nghbrs.push(node2.data.id);
                    ++degree;
                }
            ext_nghbrs[node.data.id] = nghbrs;
            ext_degree[node.data.id] = degree;
        });
    });

    var svs = new Array(); // Shapley ValueS
    graph.nodes.map(function(node) {
        var sv = 1 / (1 + ext_degree[node.data.id]);
        ext_nghbrs[node.data.id].map(function(node2) {
            sv += 1 / (1 + ext_degree[node2]);
        });
        svs[node.data.id] = sv;
    });

    return svs;
}

function calculateCentralityAlgorithm4(graph, f) {
    var g = createGraph(graph);
    var paths = jsnx.shortestPathLength(g);

    var svs = new Array(); // Shapley ValueS
    graph.nodes.map(function(node) {
        svs[node.data.id] = 0;
    });
    graph.nodes.map(function(node) {
        var distances = paths.get(parseInt(node.data.id));
        var nodes_by_dist = new Array();

        var distances_iter = distances.entries();
        var nodes_with_dist = new Array();
        for (var i = 0; i < distances.size; ++i)
            nodes_with_dist.push(distances_iter.next().value);
        nodes_with_dist.sort(function(a, b) {
                          return a[1] >= b[1];
                   }).forEach(function(arr) {
                          nodes_by_dist.push(arr[0]);
                   });

        var sum = 0.0;
        var idx = graph.nodes.length - 1;
        var curr_sv = 0.0;
        var prev_sv = -1.0;
        var prev_dist = -1.0;
        while (idx > 0) {
            var curr_dist = distances.get(nodes_by_dist[idx]);
            var f_val = f(curr_dist) / (1.0 + idx);
            curr_sv = (curr_dist == prev_dist) ? prev_sv : (f_val - sum);
            svs[nodes_by_dist[idx]] += curr_sv;
            sum += f_val / idx;

            prev_dist = curr_dist;
            prev_sv = curr_sv;
            --idx;
        }

        svs[node.data.id] += f(0.0) - sum;
    });

    return svs;
}


function sort(elem, sort_up) {
    generateResultTable(ResultJSON, elem, sort_up);
}

var ResultJSON;

function generateResultTable(resultDataJSON, sortElem, sort_up) {
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
        return sort_up ? a[sortElem] - b[sortElem] : b[sortElem] - a[sortElem] ;
    });

    var no_elements = resultDataJSON[0].values.length;
    var tableHTML = "";
    tableHTML += "<table class=\"table table-striped table-hover\">"; 
    tableHTML += "<thead><tr><th><center>Node</center></th>";
    for (var i = 0; i < resultDataJSON.length; ++i) {
        var centralityMethod = resultDataJSON[i];
        tableHTML += "<th><center>" + centralityMethod.title + "</center></th>";
    }
    tableHTML += "</tr><tr>";
    for (var i = 0; i <= resultDataJSON.length; ++i) {
        tableHTML += "<th><center><span class='glyphicon glyphicon-arrow-down sort' aria-hidden='true' onclick='sort(" + i + ",false)'></span><span class='glyphicon glyphicon-arrow-up sort' aria-hidden='true' onclick='sort(" + i + ", true)'></span></center></th>";
    }

    tableHTML += "</tr></thead>";
    tableHTML += "<tbody>";
    for (var i = 0; i < results.length; ++i) {
        var point = results[i];
        tableHTML += "<tr><td><center>" + point[0] + "</center></td>";

        for (var j = 1; j < point.length; ++j) {
            var value = point[j];
            tableHTML += "<td><center>" + value + "</center></td>";
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</tbody>";
    tableHTML += "</table>";

    $("#result_content").html(tableHTML);
}