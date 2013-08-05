define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'top-bottom-right';


    var routes = [{
        url: 'posts',
        moduleId: 'viewmodels/posts',
        name: 'Posts',
        visible: true
    }, {
        url: 'flickr',
        moduleId: 'viewmodels/flickr',
        name: 'Flickr',
        visible: true
    }];

    var startModule = 'posts';

    return {
        routes: routes,
        startModule: startModule
    };
});
