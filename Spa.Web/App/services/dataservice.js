define(['durandal/system', 'services/logger', 'services/model'],
    function (system, logger, model) {
        var getPostsPartials = function (postObservable) {
            postObservable([]);
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

                ko.mapping.fromJS(data, mapping, postObservable);
                log('Retrieved [Posts Partials] from remote data source', data, true);
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