(function(window){
    var project = function () {
            this.configure();
        },
        prototype = project.prototype;

    prototype.configure = function () {
        this._maxstep = 0;
        $("#status_content").removeClass().addClass("max0");
    };

    project.getInstance = function () {
        return window._project || (window._project = new project());
    };

    project.canGoToNextStep = function (step) {
        var instance = project.getInstance();

        if (step <= instance._maxstep + 1) {
            return true;
        }
        return false;
    };

    project.canShowStep = function (step) {
        var instance = project.getInstance();

        if (step <= instance._maxstep) {
            return true;
        }
        return false;
    };

    project.setStep = function(step) {
        var instance = project.getInstance();

        if (instance._maxstep < step) {
            instance._maxstep = step;
            $("#status_content").removeClass().addClass("max" + step);
        }
    };

    project.alert = function () {
        $("#clearProject").modal("show");
    };

    project.new = function () {
        if (!project.isSet()) {
            window._project = new project();
        }
        loadStartContentView();
    };

    project.clean = function () {
        var instance = project.getInstance();
        // clean graph
        // @todo add cleaning

        instance.configure();

        $("#start_next_content").html("");
        $("#graph_content").html("");
        $("#centralities_content").html("");
        $("#result_content").html("");

        loadStartContentView();
    };

    project.isSet = function () {
        if (window._project) {
            return true;
        }
        return false;
    };

    window.project = project;

})(window);
