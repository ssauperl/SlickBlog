define('dataservice.user',
    ['amplify'],
    function (amplify) {
        var
            init = function () {
                amplify.request.define('users', 'ajax', {
                    url: '/api/users',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                });

                amplify.request.define('user', 'ajax', {
                    url: '/api/users/{id}',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                });

                amplify.request.define('userUpdate', 'ajax', {
                    url: '/api/users',
                    dataType: 'json',
                    type: 'PUT',
                    contentType: 'application/json; charset=utf-8'
                });
            },


            getUser = function (callbacks, id) {
                return amplify.request({
                    resourceId: 'user',
                    data: { id: id },
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

            updateUser = function (callbacks, data) {
                return amplify.request({
                    resourceId: 'userUpdate',
                    data: data,
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

        init();
  
    return {
        getUser: getUser,
        updateUser: updateUser
    };
});


