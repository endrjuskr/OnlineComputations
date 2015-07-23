(function(window){
    var statusManager = function () {
            this._step = 0; // from 0
            this._elements = [
            ];
        },
        prototype = statusManager.prototype;


    prototype.init = function () {
        this._elements = [
            document.getElementById("statusStart"),
            document.getElementById("statusFirstStep"),
            document.getElementById("statusSecondStep"),
            document.getElementById("statusThirdStep"),
            document.getElementById("statusForthStep")
        ];
        this.changeStep(0);
    };

    function completeStep(element) {
        if (element) {
            // classList does not work < ie9
            element.removeClass("active");
            element.addClass("complete");
        }
    }

    function activeStep(element) {
        if (element) {
            // classList does not work < ie9
            element.removeClass("disabled");
            element.addClass("active");
        }
    }

    function disableStep(element) {
        if (element) {
            // classList does not work < ie9
            element.addClass("disabled");
        }
    }

    function clearStep(element) {
        if (element) {
            // classList does not work < ie9
            element.removeClass("disabled active complete");
        }
    }

    prototype.state = function () {
        return this._step;
    };

    prototype.next = function () {
        var self = this,
            elements = self._elements,
            currentStep = self._step;

        completeStep($(elements[currentStep]));

        // change step
        currentStep = currentStep < elements.length - 1 ? currentStep + 1 : currentStep;
        self._step = currentStep;

        // active element
        activeStep( $(elements[currentStep]))
    };

    prototype.changeStep = function(step) {
        var self = this,
            elements = self._elements,
            length = elements.length,
            element = null,
            i = 0;

        self._step = step < length ? step : length - 1;

        for (i = 0; i < step; i++) {
            element = $(elements[i]);
            clearStep(element);
            completeStep(element);
        }

        element = $(elements[step]);
        clearStep(element);
        activeStep(element);

        for (i = step + 1; i < length; i++) {
            element = $(elements[i]);
            clearStep(element);
            disableStep(element);
        }
    };

    statusManager.getInstance = function () {
        return window._statusManager || (window._statusManager = new statusManager());
    };

    window.statusManager = statusManager;

})(window);
