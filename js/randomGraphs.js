/**
 * Created by szymonmatejczyk on 11.06.15.
 */
function createAndShow(nodes, lines) {
    $("#collapseRandom").collapse('hide');

    var paramList = [];

    var nodesDataJson = getNodesDataAsJSON(nodes);
    var edgesDataJson = getEdgesDataAsJSON(lines);

    var graphData = {graph: {nodes: nodesDataJson, edges: edgesDataJson}, params: paramList};

    globalGraph = new GraphMgr(graphData);
    globalGraph.draw(document.getElementById("graph"));
    showGraph();
}

function erdosRenyi(numNodes, edgeProb) {
    var nodes = [];
    var lines = [];

    for (var i = 1; i <= numNodes; ++i) {
        nodes.push([i.toString(), 1])
    }

    for (var i = 1; i <= numNodes; ++i) {
        for (var j = i + 1; j <= numNodes; ++j) {
            if (Math.random() < edgeProb) {
                lines.push([i, j]);
                //lines.push([j, i]);
            }
        }
    }

    createAndShow(nodes, lines);
}

function unif(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preferentialAttachment(numNodes, initialCliqueSize, neighborsSize) {
    var nodes = [];
    var lines = [];

    var randomNodesArray = [];

    for (var i = 1; i <= numNodes; ++i) {
        nodes.push([i.toString(), 1]);
    }

    for (var i = 1; i <= Math.min(numNodes, initialCliqueSize); ++i) {
        for (var j = i + 1; j <= initialCliqueSize; ++j) {
            //lines.push([i, j]);
            lines.push([j, i]);
            randomNodesArray.push(i);
            randomNodesArray.push(j);
        }
    }

    for (var i = initialCliqueSize + 1; i <= numNodes; ++i) {
        var neighbors = {};

        for (var j = 1; j <= neighborsSize; ++j) {
            var randomNeighbor = randomNodesArray[unif(0, randomNodesArray.length - 1)];
            neighbors[randomNeighbor] = true;
        }

        for (var neighbor in neighbors) {
            if (neighbors.hasOwnProperty(neighbor)) {
                var n = parseInt(neighbor);
                randomNodesArray.push(n);
                randomNodesArray.push(i);
                lines.push([i, n]);
                //lines.push([n, i]);
            }
        }
    }

    createAndShow(nodes, lines);
}