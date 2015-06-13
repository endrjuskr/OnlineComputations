$(window).load(function () {
    loadStartContentView();
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

function loadStartContentView() {
    $("#start_content").load("views/defaultOptionsView.html", setFileHandler);
    showStartContent();
}

function loadPredefinedView() {
    $("#start_content").load("views/predefinedGraphView.html");
    showStartContent();
}

function loadRandomView() {
    $("#start_content").load("views/randomGraphView.html");
    showStartContent();
    showStartPointMsg("Random Graph");
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
