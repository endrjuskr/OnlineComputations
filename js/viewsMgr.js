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
        $("#nextStep").text("Start");
        $("#nextStep").attr("disabled", false);
    },
    toFirstStep = function() {
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
    toResultStep = function() {
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
    $("#start_content").load("views/introductionView.html", toStartStep);
    showStartContent();
}

function loadStartContentView() {
    // requiere fileHandler.js
    $("#start_content").load("views/defaultOptionsView.html", setFileHandler);
    showStartContent();
    toFirstStep();
}

function loadStatusView() {
    var statusManager = new window.statusManager();
    $("#status_content").load("views/statusView.html", function(){
        statusManager.init();
        window._statusManager = statusManager;
        $("#nextStep").on("click touchend", function() {
            var state = statusManager.state();
            if (state === 0) {
                loadStartContentView();
            } else if (state === 2) {
                loadCentralitiesView();
            } else if (state === 3) {
                showComputedResults();
            }
        })
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
    $("#start_content").load("views/centralitiesView.html", toThirdStep);
    $("#centralityMenu").hide();
    $("#graph_content").hide();
}

function getCentralitiesNames(centrality){
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
