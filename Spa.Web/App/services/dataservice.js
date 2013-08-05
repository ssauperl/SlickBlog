define(['durandal/system', 'services/logger'],
    function (system, logger) {
        var getPostsPartials = function (postObservable) {
            postObservable([]);
            var options = {
                url: '/api/posts',
                type: 'GET',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var posts = data;

                postObservable(posts);
                log('Retrieved [Posts Partials] from remote data source', posts, true);
            }
        };

        var dataservice = {
            getPostsPartials: getPostsPartials
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