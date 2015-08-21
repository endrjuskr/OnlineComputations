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
        $("#previousStep").attr("disabled", true);
    },
    toFirstStep = function() {
        setStatus_Step(1);
        if (project.canShowStep(2)) {
            $("#nextStep").attr("disabled", false);
        } else {
            $("#nextStep").attr("disabled", true);
        }
        $("#previousStep").attr("disabled", false);
    },
    toSecondStep = function () {
        setStatus_Step(2);
        $("#nextStep").attr("disabled", false);
        $("#previousStep").attr("disabled", false);
    },
    toThirdStep = function () {
        setStatus_Step(3);
        $("#nextStep").attr("disabled", false);
        $("#previousStep").attr("disabled", false);
    },
    toResultStep = function() {
        setStatus_Step(4);
        $("#nextStep").attr("disabled", true);
        $("#previousStep").attr("disabled", false);
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
}

function loadIntroductionView() {
    introductionManager.load();
}

function loadStartContentView() {
    startManager.load();
}

function loadDefiningGraph() {
    startFromScratch();
    toSecondStep();
    $("body").removeClass().addClass("modify");
}

function loadModifyingGraph () {
    toSecondStep();
    $("body").removeClass().addClass("modify");
}


function jumpToStep(state) {
    if (project.canGoToNextStep(state)) {
        if (state === 0) {
            loadIntroductionView();
        } else if (state === 1) {
            window.project.new();
        } else if (state === 2) {
            if (project.canShowStep(state)) {
                loadModifyingGraph();
            }
        } else if (state === 3) {
            loadCentralitiesView();
        } else if (state === 4) {
            showComputedResults();
        }
    }
}

function loadStatusView() {
    var statusManager = window.statusManager.getInstance();
    statusManager.init();

    $("#nextStep").on("click touchend", function() {
        var state = statusManager.state() + 1;
        jumpToStep(state);
    });
    $("#previousStep").on("click touchend", function() {
        var state = statusManager.state() - 1;
        jumpToStep(state);
    });
}

function loadPredefinedView() {
    $("#start_next_content").load("views/predefinedGraphView.html", function(){
        toFirstStep();
        $("body").removeClass().addClass("start predefined");
    });
    showStartContent();
}

function loadRandomView() {
    $("#start_next_content").load("views/randomGraphView.html", function(){
        toFirstStep();
        $("body").removeClass().addClass("start random");
    });
    showStartContent();
    showStartPointMsg("Random Graph");
}

function loadCentralitiesView() {
    loadFile("#centralities_content", "views/centralitiesView.html", function(){
        toThirdStep();
        $("body").removeClass().addClass("centralities");
    });
}

function loadAboutView() {
    loadFile("#about", "views/aboutView.html", function(){
        $("body").removeClass().addClass("about");
    });
}

function showStandardCentralitesView() {
    $("#myersonDescriptionContainer").hide();
    $("#standardDescriptionContainer").show();
}

function showMyersonCentralitesView() {
    $("#standardDescriptionContainer").hide();
    $("#myersonDescriptionContainer").show();
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
            toResultStep();
            // todo - onloading widget
            $("#changeWeight").hide();
            $("#nextStep").attr("disabled", true);
            window._centralitiesManager.calculate(centralitiesNamesArray);
            $("body").removeClass().addClass("results");
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

function loadGraphView(cb) {
    $("#graph_content").load("views/graphView.html", function() {
        if (cb) {
            cb();
        }
        loadModifyingGraph();
    });
}


/*============================
 *       Result content
 * */

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