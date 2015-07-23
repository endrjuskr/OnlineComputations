var ResultJSON;
var decimal_points = 4;

(function(window) {
    var manager = function() {
            this._centralities = {};
            this.init();
        },
        prototype = manager.prototype;

    function calculateCentralityDegree(graph) {
        var degree = new Array(),
            length = graph.nodes.length,
            data = null,
            i = 0;

        for (i = 0; i < length; ++i) {
            data = graph.nodes[i].data;
            degree[data.id] = 0;
        }
        for (i = 0, length = graph.edges.length; i < length; ++i) {
            data = graph.edges[i].data;
            degree[data.source] += 1;
            degree[data.target] += 1;
        }
        return degree;
    }

    function addEdge(edge) {
        return [edge.data.source, edge.data.target];
    }

    function createGraph(graph) {
        var g = new jsnx.Graph();
        g.addEdgesFrom(graph.edges.map(addEdge));

        return g;
    }

    function calculateCentralityCloseness(graph) {
        var g = createGraph(graph),
            paths = jsnx.shortestPathLength(g),
            closeness = new Array();

        graph.nodes.map(function(node) {
            var dist_sum = 0,
                node_dists = paths.get(parseInt(node.data.id));

            if (node_dists == undefined) {
                node_dists = paths.get(node.data.id);
            }
            graph.nodes.map(function(node2) {
                // TODO
                // - error; node not connected
                var value = node_dists.get(parseInt(node2.data.id));
                if(value == undefined) {
                    value = node_dists.get(node2.data.id);
                }
                dist_sum += value;
            });
            closeness[node.data.id] = 1./dist_sum;
        });
        return closeness;
    }

    function calculateCentralityBetweenness(graph) {
        var g = createGraph(graph),
            betweenness = jsnx.betweennessCentrality(g);
        return betweenness;
    }

    function calculateCentralityEigenvector(graph, max_iter, epsilon) {
        var g = createGraph(graph),
            eigenvector = jsnx.eigenvectorCentrality(g, { maxIter: max_iter, tolerance: epsilon });
        return eigenvector;
    }

    function calculateNeighbours(graph) {
        var neighbours = new Array(),
            data = null,
            length = 0,
            i = 0;
        for (i = 0, length = graph.nodes.length; i < length; ++i) {
            data = graph.nodes[i].data;
            neighbours[data.id] = new Array();
        }
        for (i = 0, length = graph.edges.length; i < length; ++i) {
            data = graph.edges[i].data;
            neighbours[data.source].push(data.target);
            neighbours[data.target].push(data.source);
        }
        return neighbours;
    }

	function calculateWeightsMatrix(graph) {
        var weightsMatrix = new Array();
        for (var i = 0; i < graph.nodes.length; ++i)
            weightsMatrix[graph.nodes[i].data.id] = new Array();
        for (var i = 0; i < graph.edges.length; ++i){
            var data = graph.edges[i].data;
            weightsMatrix[data.source][data.target] = data.weight;
            weightsMatrix[data.target][data.source] = data.weight;
        }
        return weightsMatrix;
    }

    function calculateCentralityAlgorithm1(graph) {
        var degree = calculateCentralityDegree(graph),
            neighbours = calculateNeighbours(graph),
            sv = new Array(),
            length = 0,
            data = null,
            neighbour = 0,
            i = 0,
            j = 0;

        for (i = 0, length = graph.nodes.length; i < length; ++i) {
            data = graph.nodes[i].data;
            sv[data.id] = 1 / (1 + degree[data.id]);
            for (j = 0; j < neighbours[data.id].length; ++j) {
                neighbour = neighbours[data.id][j];
                sv[data.id] += 1 / (1 + degree[neighbour]);
            }
        }
        return sv;
    }

    function calculateCentralityAlgorithm2(graph, k) {
        var degree = calculateCentralityDegree(graph);
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
            if(dist_map == undefined) {
                dist_map = paths.get(node.data.id);
            }
            graph.nodes.map(function(node2) {
                if (node2.data.id != node.data.id)
                    var value = dist_map.get(parseInt(node2.data.id));
                if(value == undefined) {
                    value = dist_map.get(node2.data.id);
                }
                if (value <= d_cutoff) {
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
            if(distances == undefined) {
                distances = paths.get(node.data.id);
            }
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
	
	function calculateMyerson(graph, charFun) {
        /** TODO
         *
         * var alpha = $("#myerson_a").val(),
         *      beta = $("#myerson_b").val(),
         *      gama = $("#myerson_c").val(),
         *      delta = $("#myerson_d").val(),
         *      whichFunction = $("#myersonFunction").val();
         */
		var res = new Array();
		var n = graph.nodes.length;
		for (var i = 0; i < n; ++i)
			res[graph.nodes[i].data.id] = 0.;
		
		var weights = new Array();
		for (var i = 0; i <= n + 1; ++i){
			weights[i] = new Array();
			for (var j = 0; j <= n + 1; ++j)
				weights[i][j] = 0.;
		}
		for (var k = 0; k <= n; ++k)
			for (var s = 0; s <= k; ++s)
				weights[s][k] = weightOfCoalition(s, k);
			
		enumerateCCs(graph, function(c, cn){
			var wIn = weights[c.length][c.length + cn.length];
			var wOut = weights[c.length + 1][c.length + cn.length];
			var cVal = charFun(c, graph);
			c.forEach(function(v){
				res[v.data.id] += wIn * cVal;
			});
			cn.forEach(function(v){
				res[v.data.id] -= wOut * cVal;
			});		
		});
		return res;
	}

	function weightOfCoalition(s, n){
		var w = 1./s;
		for (var i = s; i >= 1; --i)
			w *= i * 1./(n - i + 1);
		return w;
	}

	var GRAY = 1;
	var WHITE = 0;
	var ROOT = -1;
	var RED = -2;
	var RED_NEIGHBOUR = -3;
	
	function clone(a){
		var b = new Array()
		for (var i in a)
			b[i] = a[i];
		return b;
	}

	function enumerateCCs(graph, f){
		graph.neighs = calculateNeighbours(graph);			
		for (var i = 0; i < graph.nodes.length; ++i){
			var color = new Array();
			for (var j = 0; j < i; ++j)
				color[graph.nodes[j].data.id] = RED;
			color[graph.nodes[i].data.id] = ROOT;
			for (var j = i + 1; j < graph.nodes.length; ++j)
				color[graph.nodes[j].data.id] = WHITE;
			enumerateCCsRec(graph, f, graph.nodes[i].data.id, color, 0);
		};
	}

	function enumerateCCsRec(graph, f, nodeId, color, startIt){
		for (var i = startIt; i < graph.neighs[nodeId].length; ++i){
			var uId = graph.neighs[nodeId][i];
			if (color[uId] == WHITE){
				color[uId] = nodeId;
				enumerateCCsRec(graph, f, uId, clone(color), 0);
				color[uId] = RED_NEIGHBOUR;
			} else if (color[uId] == RED || color[uId] == RED_NEIGHBOUR)
				color[uId] = RED_NEIGHBOUR;
		}
		if (color[nodeId] == ROOT){
			color[nodeId] = GRAY;
			var coalition = new Array();
			var coalitionNeighs = new Array();
			graph.nodes.forEach(function(v){
				if (color[v.data.id] != WHITE && color[v.data.id] != ROOT && color[v.data.id] != RED && color[v.data.id] != RED_NEIGHBOUR)
					coalition.push(v);
				if (color[v.data.id] == RED_NEIGHBOUR)
					coalitionNeighs.push(v);
			});
			f(coalition, coalitionNeighs);
		} else
			enumerateCCsRec(graph, f, color[nodeId], color, graph.neighs[color[nodeId]].indexOf(nodeId) + 1);
	}

    prototype.sort = function(elem, sort_up) {
        generateResultTable(ResultJSON, elem, sort_up);
    };

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

        var tableHTML = "<div>";
        // buttons
        tableHTML += '<button type="button" class="btn btn-info" onclick="saveResultsAsCSV()">Get results as CSV</button>';
        tableHTML += '<button type="button" class="btn btn-info" onclick="saveResultsAsTex()">Get results as Tex</button>';
        tableHTML += '<button type="button" class="btn btn-info" onclick="globalGraph.saveGraphAsPNG()">Save graph</button>';
        tableHTML += "</div>";

        // table
        var no_elements = resultDataJSON[0].values.length;
        tableHTML += "<table class=\"table table-striped table-hover\">";
        tableHTML += "<thead><tr><th><center>Node</center></th>";
        for (var i = 0; i < resultDataJSON.length; ++i) {
            var centralityMethod = resultDataJSON[i];
            tableHTML += "<th><center>" + centralityMethod.title + "</center></th>";
        }
        tableHTML += "</tr><tr>";
        for (var i = 0; i <= resultDataJSON.length; ++i) {
            tableHTML += "<th><center><span class='glyphicon glyphicon-arrow-down sort' aria-hidden='true' onclick='window._centralitiesManager.sort(" + i + ",false)'></span><span class='glyphicon glyphicon-arrow-up sort' aria-hidden='true' onclick='window._centralitiesManager.sort(" + i + ", true)'></span></center></th>";
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

	function arrContains(arr, elem){
		for (var i = 0; i < arr.length; ++i)
			if (arr[i] == elem)
				return true;
		return false;
	}

    prototype.init = function(){
        this._centralities = {
            Degree: {
                name: "Degree",
                method: calculateCentralityDegree
            },
            Closeness: {
                name: "Closeness",
                method: calculateCentralityCloseness
            },
            Betweenness: {
                name: "Betweenness",
                method: calculateCentralityBetweenness
            },
            Eigevector: {
                name: "Eigevector",
                method: calculateCentralityEigenvector,
                params: [1000, 0.0001]
            },
            Algorithm1: {
                name: "SV-based degree centrality",
                method: calculateCentralityAlgorithm1
            },
            Algorithm2: {
                name: "SV-based degree",
                description: "k",
                method: calculateCentralityAlgorithm2,
                params: ["k"],
                toChange: 0
            },
            Algorithm3: {
                name: "Algorithm 3",
                description: "d_cuttoff",
                method: calculateCentralityAlgorithm3,
                params: ["d_cuttoff"],
                toChange: 0
            },
            Algorithm4: {
                name: "Algorithm 4",
                method: calculateCentralityAlgorithm4,
                params: [ function(x) { return Math.sqrt(x);} ]
            },
            Myerson: {
                name: "Myerson",
                method: calculateMyerson,
                params: [
					function(c, g){
						var res = 0.;
						var myerFun = parseInt($("#myersonFunction").val());
						if (isNaN(myerFun)) 
							myerFun = 1;
						switch (myerFun){							
						case 1:
							res = 1.;
							break;
						case 2:
						case 3:
							res = c.length;
							break;
						case 4:
						case 5:
							c.forEach(function(v){ res += v.data.weight; });
							break;
						case 6:
						case 7:
							for (var i = 0; i < c.length; ++i)
								for (var j = i + 1; j < c.length; ++j)
									if (arrContains(g.neighs[c[i].data.id], c[j].data.id))
										res += 1.;
							break;
						case 8:
						case 9:
							if (typeof graph.weightsMatrix === 'undefined')
								graph.weightsMatrix = calculateWeightsMatrix(g);
							for (var i = 0; i < c.length; ++i)
								for (var j = i + 1; j < c.length; ++j)
									if (arrContains(g.neighs[c[i].data.id], c[j].data.id))
										res += graph.weightsMatrix[c[i].data.id][c[j].data.id];
							break;
						default:
							break;						
						}
						switch (myerFun){
						case 3:
						case 5:
						case 7:
						case 9:
							res = res * res;
							break;
						default:
							break;						
						}
						return res;
					}
				]
            }
        };
    };

    prototype.calculate = function(centralitiesNames) {
        var self = this,
            length = centralitiesNames ? centralitiesNames.length : 0,
            centralities = self._centralities,
            centralityName = "",
            centrality,
            centralityParams,
            results = new Array(),
            graph = globalGraph.graphData.graph,
            params = {
                k: parseInt($("#kParam").val(), 10) || 1,
                d_cuttoff: parseInt($("#d_cutoffParam").val(), 10) || 1
            },
            algorithmResult,
            description = "",
            result,
            node,
            j = 0,
            i = 0;

        for (i = 0; i < length; i++) {
            centralityName = centralitiesNames[i];
            centrality = centralities[centralityName];
            centralityParams = centrality.params;
            if (centrality.hasOwnProperty("toChange")) {
                centralityParams[centrality.toChange] = params[centralityParams[centrality.toChange]];
            }
            algorithmResult = centrality.method.apply(null, [graph].concat(centralityParams));
            result = new Array();

            for (j = 0; j < graph.nodes.length; j++) {
                node = graph.nodes[j].data.id;
                switch (centralityName) {
                    case "Degree":
                    case "Closeness":
                        result.push({
                            key: node,
                            value: algorithmResult[node]
                        });
                        break;
                    case "Betweenness":
                    case "Eigevector":
                        if (algorithmResult.get(parseInt(node)) == undefined) {
                            result.push({
                                key: node,
                                // TODO
                                //- error; node not connected
                                value: algorithmResult.get(node).toFixed(decimal_points)
                            });
                        } else {
                            result.push({
                                key: node,
                                value: algorithmResult.get(parseInt(node)).toFixed(decimal_points)
                            });
                        }
                        break;
                    case "Algorithm1":
                    case "Algorithm2":
                    case "Algorithm3":
                    case "Algorithm4":
                    case "Myerson":
                        result.push({
                            key: node,
                            value: algorithmResult[node].toFixed(decimal_points)
                        });
                        break;
                }
            }
            description = centrality.description;
            description =  description ? description + " = " + params[description] : "";
            results.push({
                title: centrality.name + (description ? "<br> (" + description + ")" : ""),
                values: result
            });
        }

        generateResultTable(results , 0, true);
    };

    window._centralitiesManager = new manager();
})(window);