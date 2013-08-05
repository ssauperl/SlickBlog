define('dataservice.post',
	['jquery', 'amplify'],
    function ($, amplify) {
    	var
			init = function () {

				amplify.request.define('posts', 'ajax', {
					url: '/api/posts',
					dataType: 'json',
					type: 'GET'
					//cache:
				});

				amplify.request.define('post', 'ajax', {
				    url: '/api/posts/{id}',
				    dataType: 'json',
				    type: 'GET'
				    //cache:
				});

				amplify.request.define('userPost', 'ajax', {
				    url: '/api/posts',
				    dataType: 'json',
				    type: 'PUT',
				    contentType: 'application/json; charset=utf-8'
				});
			},

    		getPosts = function (callbacks) {
    			return amplify.request({
    				resourceId: 'posts',
    				success: callbacks.success,
    				error: callbacks.error
    			});
    		};

    	    getPost = function (callbacks, id) {
    	        return amplify.request({
    	            resourceId: 'post',
    	            data: { id: id },
    	            success: callbacks.success,
    	            error: callbacks.error
    	        });
    	    };

    	    updatePost = function (callbacks, data) {
    	        return amplify.request({
    	            resourceId: 'postUpdate',
    	            data: data,
    	            success: callbacks.success,
    	            error: callbacks.error
    	        });
    	    };

    	init();
			

    	return {
    	    getPosts: getPosts,
    	    getPost: getPost,
    	    updatePost: updatePost
    	};
    });