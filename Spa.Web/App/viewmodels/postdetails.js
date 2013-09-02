define(['services/dataservice', 'plugins/router', 'durandal/system', 'durandal/app', 'services/logger', 'viewmodels/comment'],
    function (dataservice, router, system, app, logger, vmComment) {
        //properties
        var post = new Object();
        var comment = ko.observable(new vmComment());

        //durandal methods
        var activate = function (id) {
            comment(new vmComment());
            ko.validation.group(comment());
            return refresh(id);
        };
        
        //local methods
        var refresh = function(id) {
            return dataservice.getPostById(id, post);
        };

        //post methods
        var select = function () {
            if (post && post.id()) {
                var url = '#/postedit/' + post.id();
                router.navigate(url);
            }
        };
        
        //comments methods
        var editComment = function () {
            return dataservice.getComment(post.id(), this.id(), comment);
        };
        
        var saveComment = function () {
            if (comment().isValid()) {
                if (comment().id)
                    return dataservice.updateComment(post.id(), comment).then(complete);
                else 
                    return dataservice.saveComment(post.id(), comment).then(complete);
                
                function complete() {
                    refresh(post.id()).then(function () {
                        comment(new vmComment());
                        ko.validation.group(comment());
                    });
                }

            }
            else {
                comment().errors.showAllMessages();
            }
        };

        var deleteComment = function() {
            return dataservice.deleteComment(post.id(), this.id()).then(function() {
                refresh(post.id());
            });
        };

        var dismissComment = function() {
            comment(new vmComment());
        };

        var vm = {
            activate: activate,
            post: post,
            select: select,
            comment: comment,
            editComment: editComment,
            saveComment: saveComment,
            deleteComment: deleteComment,
            dismissComment: dismissComment
        };

        return vm;
    });