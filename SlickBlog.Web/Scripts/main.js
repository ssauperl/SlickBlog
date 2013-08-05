(function () {
    var root = this;

    define3rdPartyModules();

    function define3rdPartyModules() {
        // These are already loaded via bundles. 
        // We define them and put them in the root object.
        define('jquery', [], function () { return root.jQuery; });
        define('bootstrap', [], function () { return root.bootstrap; });
        define('ko', [], function () { return root.ko; });
        define('amplify', [], function () { return root.amplify; });
        define('underscore', [], function () { return root._; });
        define('sammy', [], function () { return root.Sammy; });
        define('toastr', [], function () { return root.toastr; });
        boot();
    }


    function boot() {
        require(['bootstrapper'], function (bs) { bs.run(); });
    }
})();