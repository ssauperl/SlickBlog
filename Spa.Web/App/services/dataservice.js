define(['durandal/system', 'services/logger'],
    function (system, logger) {
        var getPosts = function (postsObservable) {
            postsObservable([]);
            var options = {
                url: '/api/posts',
                type: 'GET',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var mapping = {
                    'ignore': ["Blog", "Comments"]
                }

                ko.mapping.fromJS(data, mapping, postsObservable);
                log('Retrieved Posts from remote data source', data, true);
            }
        };

        var getPostById = function (id, postObservable) {
            //postObservable();
            var options = {
                url: '/api/posts/' + id,
                type: 'GET',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var mapping = {
                    'ignore': ["Blog", "Comments"]
                }

                postObservable(ko.mapping.fromJS(data, mapping));
                log('Retrieved Post from remote data source', data, true);
            }
        };


        var savePost = function (postObservable) {
            var options = {
                url: '/api/posts/',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.toJSON(postObservable)
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                //setting post.Id so we know where to redirect the user
                postObservable().Id(data);
                log('Post saved to remote data source', data, true);
            }
        };

        var updatePost = function (id, postObservable) {
            //todo check
            var options = {
                url: '/api/posts/' + id,
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.toJSON(postObservable)
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Post updated on remote data source', data, true);
            }
        };

        var deletePost = function (id) {
            var options = {
                url: '/api/posts/' + id,
                type: 'DELETE',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Post deleted from remote data source', data, true);
            }
        };

        var dataservice = {
            getPosts: getPosts,
            savePost: savePost,
            getPostById: getPostById,
            updatePost: updatePost,
            deletePost: deletePost
        };

        return dataservice;

        //#region Internal methods        
        function queryFailed(jqXHR, textStatus) {
            var msg = 'Error retreiving data. ' + textStatus;
            logger.logError(msg, jqXHR, system.getModuleId(dataservice), true);
        };


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(dataservice), showToast);
        };
        //#endregion
});