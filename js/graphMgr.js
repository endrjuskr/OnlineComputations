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
                                'font-size': 'small',
                                'color': 'white',
                                'background-color': '#1971dd'
                            }
                        },
                        {
                            selector: 'node:selected',
                            css: {
                                'content': 'data(weight)',
                                'color': 'black'
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
                            css: {
                                'width': '2px',
                                'line-color': '#A1DEF0',
                                'content': 'data(weight)',
                                'color': '#99B9E4',
                                'text-valign' : 'top'
                            }
                        },
                        {
                            selector: 'edge:selected',
                            css: {
                                'color': '#1971DD',
                                'font-size': '24px',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            selector: ':selected',
                            css: {
                                'background-color': '#DDD31B',
                                'line-color': '#DDD31B',
                                'target-arrow-color': 'black',
                                'source-arrow-color': 'black'
                            }
                        }
                    ],
                    elements: globalGraph.graphData.graph,
                    layout: {
                        name: 'cose',
                        padding: 5,
                        ready: function() {
                            globalGraph.printedGraph.center();
                        }
                    },
                    zoom: 1,
                    zoomingEnabled: false,
                    ready: function() {
                        $("#graph").trigger("graphready");
                        globalGraph.printedGraph.center();
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
        var graph = this.printedGraph;
        graph.add({
            group: "nodes",
            data: {
                id: "" + (graph.nodes().length + 1),
                weight: 1
            },
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
                target: selectedNodes[1]._private.data.id,
                weight: 1
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
                nodesArray.push({
                    data: {
                        id: elem._private.data.id,
                        weight: elem._private.data.weight
                    }
                });
            else if (elem.isEdge())
                edgesArray.push({
                    data: {
                        id: elem._private.data.id,
                        source: elem._private.data.source,
                        target: elem._private.data.target,
                        weight:  elem._private.data.weight
                    }
                });
        }
        this.graphData = {graph: {nodes: nodesArray, edges: edgesArray}, params: this.graphData.params};
        $("#kParam").attr({"max": this.graphData.graph.nodes.length});
        this.printedGraph.center();
    };

    this.saveGraphAsPNG = function () {
        var pngGraph = this.printedGraph.png({
                full: true
            }),
            downloadLink = document.createElement("a");

        //@todo
        // - check all browsers
        if (navigator.msSaveBlob) {
            // @todo
            // - it does not work!
            var imgAsBlob = new Blob([pngGraph]);
            window.navigator.msSaveOrOpenBlob(imgAsBlob, "graph.png");
        } else {
            downloadLink.download = "graph.png";
            downloadLink.href = pngGraph;
            downloadLink.click();
        }
    };

    this.graphZooming = function(level) {
        var currentGraph = this.printedGraph;
        currentGraph.zoomingEnabled(true);
        if (level) {
            zoomingLevel += 0.1;
        } else {
            zoomingLevel -= 0.1;
        }
        zoomingLevel = zoomingLevel < 0.5 ? 0.1 : zoomingLevel;
        currentGraph.zoom(zoomingLevel);
        currentGraph.center();
        currentGraph.zoomingEnabled(false);
    };

    this.refresh = function () {
        this.printedGraph.reset();
        this.printedGraph.center();
    };

    this.showEdgeWeight = function(show) {
        if (show) {
            this.printedGraph.style().selector("edge").style({content: 'data(weight)'}).update()
        } else {
            this.printedGraph.style().selector("edge").style({content: ''}).update();
        }
    };

    this.changeWeight = function(value) {
        var graph = this.printedGraph,
            selected = graph && graph.$(":selected");

        if (selected) {
            selected.forEach(function (element, index, collection) {
                element.data("weight", value);
            });
        }
    }
}

var globalGraph;
var zoomingLevel = 1.0;