$(window).load(function () {
    loadIntroductionView();
    loadStatusView();
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});

var toStartStep = function () {
        setStatus_Step(0);
        $("#nextStep").text("Start");
        $("#nextStep").attr("disabled", false);
    },
    toFirstStep = function () {
        setStatus_Step(1);
        $("#nextStep").text("Next");
        $("#nextStep").attr("disabled", true);
    },
    toSecondStep = function () {
        setStatus_Step(2);
        $("#nextStep").text("Next");
        $("#nextStep").attr("disabled", false);
    },
    toThirdStep = function () {
        setStatus_Step(3);
        $("#nextStep").text("Next");
        $("#nextStep").attr("disabled", false);
    },
    toResultStep = function () {
        setStatus_Step(4);
        $("#nextStep").text("Next");
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
    $("#start_content").show();
    $("#start_point_msg").hide();
    hideGraphView();
    hideResultView();
}

function loadIntroductionView() {
    Dajaxice.centralities.get_introduction_view(function (data) {
        $("#start_content").html(data);
        toStartStep();
        showStartContent();
    }, EMPTY_DICT);
}

function loadStartContentView() {
    // requiere fileHandler.js
    Dajaxice.centralities.get_default_options_view(function (data) {
        $("#start_content").html(data);
        setFileHandler();
        showStartContent();
        toFirstStep();
    }, EMPTY_DICT);
}

function loadStatusView() {
    var statusManager = new window.statusManager();
    Dajaxice.centralities.get_status_view(function (data) {
        $("#status_content").html(data);
        statusManager.init();
        window._statusManager = statusManager;
        $("#nextStep").on("click touchend", function () {
            var state = statusManager.state(),
                centralities;
            if (state === 0) {
                loadStartContentView();
            } else if (state === 2) {
                loadCentralitiesView();
            } else if (state === 3) {
                centralities = Array.prototype.slice.call(document.querySelectorAll(".centralityChoose :checked"));
                if (centralities.length) {
                    showComputedResults();
                } else {
                    $("#centralityAlert").show();
                    setTimeout(function () {
                        $("#centralityAlert").hide();
                    }, 1500);
                }
            }
        });
    }, EMPTY_DICT);
}

function loadPredefinedView() {
    Dajaxice.centralities.get_predefined_graph_view(function (data) {
        $("#start_content").html(data);
        toFirstStep();
        showStartContent();
    }, EMPTY_DICT);
    //$("#start_content").load("views/predefinedGraphView.html", toFirstStep);
    //showStartContent();
}

function loadRandomView() {
    Dajaxice.centralities.get_random_graph_view(function (data) {
        $("#start_content").html(data);
        toFirstStep();
        showStartContent();
        showStartPointMsg("Random Graph");
    }, EMPTY_DICT);

    //$("#start_content").load("views/randomGraphView.html", toFirstStep);
    //showStartContent();
    //showStartPointMsg("Random Graph");
}

function loadCentralitiesView() {
    Dajaxice.centralities.get_centralities_view(function (data) {
        $("#start_content").html(data);
        $("#centralityAlert").hide();
        toThirdStep();
        $("#centralityMenu").hide();
        $("#graph_content").hide();
    }, EMPTY_DICT);

    //$("#start_content").load("views/centralitiesView.html", function () {
    //    $("#centralityAlert").hide();
    //    toThirdStep();
    //});
    //$("#centralityMenu").hide();
    //$("#graph_content").hide();
}

function getCentralitiesNames(centrality) {
    return centrality.id;
}

function showComputedResults() {
    var centralities = Array.prototype.slice.call(document.querySelectorAll(".centralityChoose :checked"));
    $("#start_content").hide();
    $("#graph_content").show();

    // todo - onloading widget
    toResultStep();
    $("#nextStep").attr("disabled", true);
    window._centralitiesManager.calculate(centralities.map(getCentralitiesNames));
}

function setStatus_Step(n) {
    var statusManager = window._statusManager;
    if (statusManager) {
        statusManager.changeStep(n);
    }
}

/*============================
 *       Graph content
 * */
function hideGraphView() {
    $("#graph_content").html("");
}

function showGraphView() {
    $("#graph_content").show();
}

function loadGraphView(cb) {
    Dajaxice.centralities.get_graph_view(function (data) {
        $("#graph_content").html(data);
        if (cb) {
            cb();
        }
        toSecondStep();
        showGraphView();
    }, EMPTY_DICT);


    //$("#graph_content").load("views/graphView.html", function () {
    //    if (cb) {
    //        cb();
    //    }
    //    toSecondStep();
    //});
    //showGraphView();
}


/*============================
 *       Result content
 * */
function showResultView() {
    $("#result_content").show();
}

function hideResultView() {
    $("#result_content").html("");
}

/*============================
 *       Start actions
 * */
function startFromScratch() {
    var graphData = processData("");
    globalGraph = new GraphMgr(graphData);
    globalGraph.draw();
    hideStartContent("Define Graph");
    showStartPointMsg("Define Graph");
    toSecondStep();
}

function uploadGraph(elem) {
    var g = null;
    for(var i = 0; i < graphs.length; ++i) {
        if(graphs[i].key == elem) {
            g = graphs[i].value
        }
    }
    var graphData = processData(g);
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
function hideTooltips() {
    $(".tooltip").hide();
}
