define(function () {
    // Create generic handler for ajax errors
    // so we can deal with 401's in one place
    $(document).ajaxError(ajaxErrors);

    var scheme,
        token,
        loginUrl = '/api/token',
        getUrl = '/api/values',
        requestedAction = null;

    
    $(document).on("click", "#login", function () {
        $('#loginStatus').text('Attempting login');

        // For our first login we need to 
        scheme = "Basic";
        token = createBasicAuthToken();

        makeRequest(loginUrl).done(function (result) {
            $('#loginStatus').text('Logged in');

            // Once we have made a sucessful call we need to set the
            // authorization scheme to Session and extract the token
            // from the response
            scheme = 'Session';
            token = result.access_token;

            // if requestedAction has value then we need to
            // execute it
            if (requestedAction) {
                requestedAction();
            }
        }).fail(function (result) {
            $('#returnedData').text(result.statusText);
            $('#loginStatus').text('Error logging in');
        });
    });
    
    $(document).on("click", "#getById", function () {
        // record the action in case we get 401 and need
        // to execute once user is authenticated
        requestedAction = function () {
            $('#getById').trigger('click');
        };

        getRequest(getUrl + '/1');
    });
    
    $(document).on("click", "#getAll", function () {
        // record the action in case we get 401 and need
        // to execute once user is authenticated
        requestedAction = function () {
            $('#getAll').trigger('click');
        };

        getRequest(getUrl);
    });

    var getRequest = function (url) {
        makeRequest(url).done(function (result) {
            $('#returnedData').text(result);
        }).fail(function (result) {
            $('#returnedData').text(result.statusText);
        }).always(function () {
            // ensure requestedAction is cleared
            requestedAction = null;
        });
    }

    var makeRequest = function (url) {
        var ajaxSettings = {
            type: 'GET',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", scheme + " " + token);
            }
        };

        return $.ajax(ajaxSettings);
    }

    var createBasicAuthToken = function () {
        var uid = $("#username").val();
        var pwd = $("#password").val();

        // the btoa call isn't ideal due to browser differeneces
        // but is sufficent for this naive example
        return btoa(uid + ':' + pwd);
    }

    var ajaxErrors = function (event, jqXhr) {
        if (jqXhr.status == 401) {
            $('#returnedData').text('User not authenticated');
        }
    }
    var activate = function () {
        
    };

    var vm = { activate: activate }

    return vm;

});