﻿define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-top-right';
    ko.validation.configure({
        decorateElement: true,
        errorElementClass: 'has-error'
    });


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
    }, {
        url: 'postadd',
        moduleId: 'viewmodels/postedit',
        name: 'Add Post',
        visible: true
    }, {
        url: 'postedit/:id',
        moduleId: 'viewmodels/postedit',
        name: 'edit post',
        visible: false
    }, {
        url: 'postdetail/:id',
        moduleId: 'viewmodels/postdetail',
        name: 'Edit false',
        visible: false
    }, {
        url: 'tagsedit',
        moduleId: 'viewmodels/tagsedit',
        name: 'Edit tags',
        visible: false
    }];

    var startModule = 'posts';

    return {
        routes: routes,
        startModule: startModule
    };
});
