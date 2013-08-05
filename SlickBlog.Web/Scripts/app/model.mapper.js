define('model.mapper',
	['model'],
    function (model) {
        var
    	post = {
    	    getDtoId: function (dto) { return dto.id; },
    	    fromDto: function (dto, item) {
    	        item = item || new model.Post().id(dto.id);
    	        item.id(dto.id)
    	        item.title(dto.title);
    	        item.contentText(dto.contentText);
    	        return item;
    	    }
    	},

        user = {
            getDtoId: function (dto) { return dto.id; },
            fromDto: function (dto, item) {
                item = item || new model.User().id(dto.id);
                item.firstName(dto.firstName)
                    .lastName(dto.lastName)
                    .username(dto.username)
                    .email(dto.email)
                    .imageSource(dto.imageSource)
                item.dirtyFlag().reset();
                return item;
            }
        };

    	return {
    	    post: post,
    	    user: user
		};
    });