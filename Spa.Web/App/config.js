define(function() {
    //toastr config
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-top-right';

    //ko validation config
    ko.validation.configure({
        decorateElement: true,
        errorElementClass: 'has-error'
    });

    //route config
    var routes = [{
            route: 'posts',
            moduleId: 'viewmodels/posts',
            title: 'Posts',
            nav: true
        }, {
            route: 'postadd',
            moduleId: 'viewmodels/postedit',
            title: 'Add Post',
            nav: true//,
            //authorize: ["admin"]
        }, {
            route: 'postedit(/:id)',
            moduleId: 'viewmodels/postedit',
            name: 'edit post',
            nav: false//,
            //authorize: ["admin"]
        }, {
            route: 'postdetail/:id',
            moduleId: 'viewmodels/postdetail',
            title: 'Edit false',
            nav: false
        }, {
            route: 'tagsedit',
            moduleId: 'viewmodels/tagsedit',
            title: 'Edit tags',
            nav: false
        }, {
            route: 'login',
            moduleId: 'viewmodels/account/login',
            title: 'Login',
            nav: false
        }, {
            route: 'externalloginconfirmation',
            moduleId: 'viewmodels/account/externalloginconfirmation',
            title: 'External login confirmation',
            nav: false
        }, {
            route: 'externalloginfailure',
            moduleId: 'viewmodels/account/externalloginfailure',
            title: 'External login failure',
            nav: false
        }, {
            route: 'register',
            moduleId: 'viewmodels/account/register',
            title: 'Register',
            nav: false
        }, {
            route: 'account',
            moduleId: 'viewmodels/account/account',
            title: 'Account',
            nav: false,
            authorize: ["user", "admin"]
        }];

    var startModule = 'posts';

    return {
        routes: routes,
        startModule: startModule
    };
});
