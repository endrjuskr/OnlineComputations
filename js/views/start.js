(function(window){
    var startManager = function () {
        },
        prototype = startManager.prototype;

    prototype.show = function () {

    };

    startManager.load = function () {
        // requiere fileHandler.js
        loadFile("#start_content", "views/defaultOptionsView.html", function() {
            setFileHandler();
            $("body").removeClass().addClass("start");
            toFirstStep();
        });
    };

    startManager.getInstance = function () {
        return window._startManager || (window._startManager = new startManager());
    };

    window.startManager = startManager;

})(window);
