$(window).load(function () {
    loadStartContentView();
    loadStatusView();
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});


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

function changeStatus() {
    setStatus_NextStep();
}

function loadStartContentView() {
    // requiere fileHandler.js
    $("#start_content").load("views/defaultOptionsView.html", setFileHandler);
    showStartContent();
    setStatus_FirstStep();
}

function loadStatusView() {
    var statusManager = new window.statusManager();
    $("#status_content").load("views/statusView.html", function(){
        statusManager.init();
        window._statusManager = statusManager;
    });
}

function loadPredefinedView() {
    $("#start_content").load("views/predefinedGraphView.html", changeStatus);
    showStartContent();
}

function loadRandomView() {
    $("#start_content").load("views/randomGraphView.html", changeStatus);
    showStartContent();
    showStartPointMsg("Random Graph");
}

function loadCentralitiesView() {
    $("#start_content").load("views/centralitiesView.html", changeStatus);
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
    setStatus_NextStep();
    window._centralitiesManager.calculate(centralities.map(getCentralitiesNames));
}

function setStatus_NextStep() {
    var statusManager = window._statusManager;
    if (statusManager) {
        statusManager.next();
    }
}

function setStatus_FirstStep() {
    var statusManager = window._statusManager;
    if (statusManager) {
        statusManager.changeStep(0);
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
    $("#graph_content").load("views/graphView.html", cb);
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
    changeStatus();
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
