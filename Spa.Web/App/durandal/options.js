define(['toastr'], function (toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-top-right';
    Options = function () {
        pageTitle = 'SlickBlog'
    };
    return {
        Options: Options
    };
});