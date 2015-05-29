function GraphMgr(graphData) {
    this.graphData = graphData;
    this.printedGraph = null;
    this.draw = function (graphElement) {
        this.printedGraph = cytoscape({
            container: graphElement,
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
            elements: this.graphData.graph,
            layout: {
                name: 'cose',
                padding: 5
            }
        });
    };
    this.addNode = function () {
        this.printedGraph.add({
            group: "nodes",
            position: {x: 200, y: 200}
        });
        this.printedGraph.fit()
    };
    this.removeNodes = function () {
        var selectedNodes = this.printedGraph.$('node:selected');
        if (selectedNodes.length > 0)
            this.printedGraph.remove(selectedNodes);
        else
            alert("Nie zaznaczono żadnego wierzchołka!");
    };
    this.addEdge = function () {
        var selectedNodes = this.printedGraph.$('node:selected');
        if (selectedNodes.length != 2) {
            alert("Wybierz dokładnie dwa wierzchołki");
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
    }
}

var globalGraph;