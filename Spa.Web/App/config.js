define(function () {
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
    }, {
        url: 'login',
        moduleId: 'viewmodels/login',
        name: 'login',
        visible: true
    },
    { url: 'login', moduleId: 'viewmodels/account/login', name: 'Login', visible: false },
    { url: 'externalloginconfirmation', moduleId: 'viewmodels/account/externalloginconfirmation', name: 'External login confirmation', visible: false },
	{ url: 'externalloginfailure', moduleId: 'viewmodels/account/externalloginfailure', name: 'External login failure', visible: false },
	{ url: 'register', moduleId: 'viewmodels/account/register', name: 'Register', visible: false },
	{ url: 'account', moduleId: 'viewmodels/account/account', name: 'Account', visible: false, settings: { authorize: ["User"] } }];

    var startModule = 'posts';

    return {
        routes: routes,
        startModule: startModule
    };
});
