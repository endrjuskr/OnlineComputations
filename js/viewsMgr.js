$(window).load(function () {
    loadIntroductionView();
    loadStatusView();

    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});

var toStartStep = function() {
        setStatus_Step(0);
        $("#nextStep").attr("disabled", false);
    },
    toFirstStep = function() {
        setStatus_Step(1);
        $("#nextStep").attr("disabled", true);
    },
    toSecondStep = function () {
        setStatus_Step(2);
        $("#nextStep").attr("disabled", false);
    },
    toThirdStep = function () {
        setStatus_Step(3);
        $("#nextStep").attr("disabled", false);
    },
    toResultStep = function() {
        setStatus_Step(4);
        $("#nextStep").attr("disabled", true);
    };

function showStartPointMsg(msg) {
    $("#start_point_msg").show();
    $("#start_point").html(msg);
}

/*============================
 *       Start content
 * */
function hideStartContent() {
    $("#start_content").html("");
}

function showStartContent() {
    $("#start_content > *").show();
    $("#start_point_msg").hide();
    hideGraphView();
    hideResultView();
}

function loadIntroductionView() {
    $("#start_content").load("views/introductionView.html", function() {
        $("body").addClass("first");
        toStartStep();
    });
    $("#graph_content").html("");
    $("#result_content").html("");
    $("#page").show();
    $("#status_content").show();
    $("#about").hide();
}

function loadStartContentView() {
    // requiere fileHandler.js
    $("#start_content").load("views/defaultOptionsView.html", function() {
        setFileHandler();
        $("body").removeClass("first");
        showStartContent();
        toFirstStep();
    });
    $("#page").show();
    $("#status_content").show();
    $("#about").hide();
}

function loadStatusView() {
    var statusManager = window.statusManager.getInstance();
    statusManager.init();
    $("#nextStep").on("click touchend", function() {
        var state = statusManager.state(),
            centralities;
        if (state === 0) {
            loadStartContentView();
        } else if (state === 2) {
            loadCentralitiesView();
        } else if (state === 3) {
            showComputedResults();
        }
    });
}

function loadPredefinedView() {
    $("#start_content").load("views/predefinedGraphView.html", toFirstStep);
    showStartContent();
}

function loadRandomView() {
    $("#start_content").load("views/randomGraphView.html", toFirstStep);
    showStartContent();
    showStartPointMsg("Random Graph");
}

function loadCentralitiesView() {
    $("#start_content").load("views/centralitiesView.html", function(){
        toThirdStep();
    });
    $("#centralityMenu").hide();
    $("#graph_content").hide();
}

function loadAboutView() {
    $("#about").load("views/aboutView.html", function(){
        $("#page").hide();
        $("#status_content").hide();
        $("#about").show();
    });
}

function getCentralitiesNames(centrality){
    return centrality.id;
}

function showComputedResults() {
    var centralities = Array.prototype.slice.call(document.querySelectorAll(".centralityChoose input[name=centralities]:checked")),
        nodeLength = (globalGraph && globalGraph.graphData && globalGraph.graphData.graph && globalGraph.graphData.graph.nodes) ?
            globalGraph.graphData.graph.nodes.length : 0,
        centralitiesNamesArray = centralities.map(getCentralitiesNames),
        myerson = centralitiesNamesArray.indexOf("Myerson"),
        // Myerson was not checked or graph has less nodes than 21
        myersonCanBeComputed = (myerson === -1) || ((myerson > -1) && (nodeLength < 21));

    if (centralitiesNamesArray.length) {
        if (myersonCanBeComputed) {
            $("#start_content > *").hide();
            $("#graph_content").show();

            toResultStep();
            // todo - onloading widget
            $("#changeWeight").hide();
            $("#nextStep").attr("disabled", true);
            window._centralitiesManager.calculate(centralitiesNamesArray);
        } else {
            // error - no centrality chosen
            $("#alert").html("<b>Error: </b> Sorry, Myerson can be computed only for graph with less than 21 nodes.");
            $("#alert").show("slow");
            setTimeout(function(){
                $("#alert").hide("slow");
            }, 3000);
        }
    } else {
        // error - no centrality chosen
        $("#alert").html("<b>Error: </b> No centrality was selected.")
        $("#alert").show("slow");
        setTimeout(function(){
            $("#alert").hide("slow");
        }, 3000);
    }
}

function setStatus_Step(n) {
    var statusManager = window._statusManager;
    if (statusManager) {
        statusManager.changeStep(n);
    }
    $("#alert").hide();
}

/*============================
 *       Graph content
 * */
function hideGraphView() {
    $("#graph_content").html("");
}

function showGraphView() {
    $("#graph_content").show();
    $("#changeWeight").show();
}

function loadGraphView(cb) {
    $("#graph_content").load("views/graphView.html", function() {
        if (cb) {
            cb();
        }
        toSecondStep();
    });
    showGraphView();
}


/*============================
 *       Result content
 * */
function showResultView() {
    $("#result_content").show();
    $("#changeWeight").hide();
}

function hideResultView() {
    $("#result_content").html("");
}

/*============================
 *       Start actions
 * */
function startFromScratch() {
    var graphData = processData(graphs[3]);
    globalGraph = new GraphMgr(graphData);
    globalGraph.draw();
    hideStartContent("Define Graph");
    showStartPointMsg("Define Graph");
    toSecondStep();
}

function uploadGraph(elem) {
    var graphData = processData(graphs[elem]);
    globalGraph = new GraphMgr(graphData);
    globalGraph.draw();
    hideStartContent();
    showStartPointMsg("Pre-defined Graph");
}

function uploadFile() {
    $("#fileLoader").click();
}

/*============================
 *       TooltipMGR
 * */
function hideTooltips(){
    $(".tooltip").hide();
}

function selectCentralityOnList(element, centrality){
    var centralityToSet = $("#" + centrality);
    if (element) {
        centralityToSet.prop("checked", !centralityToSet.prop("checked"));
    }
}

function showHideEdgeWeight (element) {
    var isShown = $(element).hasClass("shown");

    globalGraph.showEdgeWeight(!isShown);
    $(element).toggleClass("shown");

    if (isShown) {
        $(element).text("Show weight of edges");
    } else {
        $(element).text("Hide weight of edges");
    }
}

function changeWeight() {
    var value = parseInt($("#newWeightValue").val(), 10);

    if (value) {
       globalGraph.changeWeight(value);
    }
}

function onSelectedGraphElementInfo(event) {
    var element = $("#changeWeightAlert");
    element.removeClass("hidden");
    setTimeout(function(){
       element.hide();
    }, 10000);
}

function setFunction(element, index) {
    $("#myersonFunction").html($(element).html());
    $("#myersonFunction").val(index);
}