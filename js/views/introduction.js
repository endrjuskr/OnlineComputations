(function(window){
    var introductionManager = function () {
        },
        prototype = introductionManager.prototype;

    introductionManager.load = function () {
        loadFile("#introduction_content", "views/introductionView.html", function() {
            $("body").removeClass().addClass("first");
            toStartStep();
        });
    };

    introductionManager.getInstance = function () {
        return window._introductionManager || (window._introductionManager = new introductionManager());
    };

    introductionManager.startNewProject = function () {
        var project = window.project;
        if (project.isSet()) {
            project.alert();
        } else {
            project.new();
        }
    };

    window.introductionManager = introductionManager;

})(window);
