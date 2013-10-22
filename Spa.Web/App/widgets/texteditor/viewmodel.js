define(['knockout', 'services/ko.bindingHandlers'],
    function (ko) {
        var ctor = function () { };

        ctor.prototype.activate = function (settings) {
            this.settings = settings;
        };


        return ctor;

    });