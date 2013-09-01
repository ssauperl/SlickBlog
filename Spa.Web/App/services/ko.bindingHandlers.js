define(['jquery', 'knockout', 'wysihtml5'], function ($, ko) {
    ko.bindingHandlers.wysihtml5 = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var control = new wysihtml5.Editor(element, {
                toolbar: "wysihtml5-toolbar",
                parserRules: wysihtml5ParserRules // defined in parser rules set 
            });

            control.on("change", onChange);

            function onChange() {
                var observable = valueAccessor();
                observable(control.getValue());
            }
            
            $(element).data("wysihtml5", control);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var content = valueAccessor();

            if (content != undefined) {
                var control = $(element).data("wysihtml5");
                control.setValue(content());
            }
        }
    };
});