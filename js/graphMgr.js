function GraphMgr(graphData) {
    this.graphData = graphData;
    this.draw = function (graphElement) {
        var cy = cytoscape({
            container: graphElement,
            style: [
                {
                    selector: 'node',
                    css: {
                        'content': 'data(id)',
                        'text-valign': 'center',
                        'text-halign': 'center'
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
            elements: this.graphData,
            layout: {
                name: 'cose',
                padding: 5
            }
        });
    };
}

var globalGraph;