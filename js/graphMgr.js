function GraphMgr(graphData) {
    loadGraphView();
    this.graphData = graphData;
    this.printedGraph = null;
    $("#kParam").attr({"max": this.graphData.graph.nodes.length});
    this.draw = function (cb) {
        loadGraphView(
            function () {
                globalGraph.printedGraph = cytoscape({
                    container: document.getElementById("graph"),
                    style: [
                        {
                            selector: 'node',
                            css: {
                                'content': 'data(id)',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'font-size': 'small'
                            }
                        },
                        {
                            selector: '$node > node',
                            css: {
                                'padding-top': '10px',
                                'padding-left': '10px',
                                'padding-bottom': '10px',
                                'padding-right': '10px',
                                'text-valign': 'top',
                                'text-halign': 'center'
                            }
                        },
                        {
                            selector: 'edge',
                        },
                        {
                            selector: ':selected',
                            css: {
                                'background-color': 'black',
                                'line-color': 'black',
                                'target-arrow-color': 'black',
                                'source-arrow-color': 'black'
                            }
                        }
                    ],
                    elements: globalGraph.graphData.graph,
                    layout: {
                        name: 'cose',
                        padding: 5
                    }
                });
            });
        if (cb) {
            cb();
            showStartPointMsg("Upload graph");
        }
    };
    this.fitPosition = function () {
        this.printedGraph.layout();
    };
    this.addNode = function () {
        this.printedGraph.add({
            group: "nodes",
            position: {x: 200, y: 200}
        });
        this.fitPosition();
        this.reloadGraphData();
    };
    this.removeNodes = function () {
        var selectedNodes = this.printedGraph.$('node:selected');
        if (selectedNodes.length == 0) {
            alert("There is no node selected!");
            return;
        }
        this.printedGraph.remove(selectedNodes);
        this.reloadGraphData();
    };
    this.addEdge = function () {
        var selectedNodes = this.printedGraph.$('node:selected');
        if (selectedNodes.length != 2) {
            alert("Please choose exactly two nodes!");
            return;
        }
        var edges = this.printedGraph.$('edge');
        this.printedGraph.add({
            group: "edges",
            data: {
                id: "e" + edges.length.toString(),
                source: selectedNodes[0]._private.data.id,
                target: selectedNodes[1]._private.data.id
            }
        });
        this.reloadGraphData();
    };
    this.reloadGraphData = function () {
        var graphElems = this.printedGraph._private.elements;
        var nodesArray = new Array();
        var edgesArray = new Array();
        for (var i = 0; i < graphElems.length; ++i) {
            var elem = graphElems[i];
            if (elem.isNode())
                nodesArray.push({data: {id: elem._private.data.id, weight: elem._private.data.weight}});
            else if (elem.isEdge())
                edgesArray.push({
                    data: {
                        id: elem._private.data.id,
                        source: elem._private.data.source,
                        target: elem._private.data.target
                    }
                });
        }
        this.graphData = {graph: {nodes: nodesArray, edges: edgesArray}, params: this.graphData.params};
        $("#kParam").attr({"max": this.graphData.graph.nodes.length});
    }
}

var globalGraph;