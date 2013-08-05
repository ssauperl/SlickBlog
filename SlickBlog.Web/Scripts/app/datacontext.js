﻿define('datacontext',
    ['jquery', 'underscore', 'ko', 'model', 'model.mapper', 'dataservice', 'config', 'utils'],
    function ($, _, ko, model, modelmapper, dataservice, config, utils) {
        var
            logger = config.logger,
            getCurrentUserId = function () {
                return config.currentUser().id();
            },

            itemsToArray = function (items, observableArray, filter, sortFunction) {
                // Maps the memo to an observableArray, 
                // then returns the observableArray
                if (!observableArray) return;

                // Create an array from the memo object
                var underlyingArray = utils.mapMemoToArray(items);

                if (filter) {
                    underlyingArray = _.filter(underlyingArray, function (o) {
                        var match = filter.predicate(filter, o);
                        return match;
                    });
                }
                if (sortFunction) {
                    underlyingArray.sort(sortFunction);
                }
                //logger.info('Fetched, filtered and sorted ' + underlyingArray.length + ' records');
                observableArray(underlyingArray);
            },
            mapToContext = function (dtoList, items, results, mapper, filter, sortFunction) {
                // Loop through the raw dto list and populate a dictionary of the items
                items = _.reduce(dtoList, function (memo, dto) {
                    var id = mapper.getDtoId(dto);
                    var existingItem = items[id];
                    memo[id] = mapper.fromDto(dto, existingItem);
                    return memo;
                }, {});
                itemsToArray(items, results, filter, sortFunction);
                //logger.success('received with ' + dtoList.length + ' elements');
                return items; // must return these
            },
            EntitySet = function (getFunction, mapper, nullo, updateFunction) {
                var items = {},
                    // returns the model item produced by merging dto into context
                    mapDtoToContext = function (dto) {
                        var id = mapper.getDtoId(dto);
                        var existingItem = items[id];
                        items[id] = mapper.fromDto(dto, existingItem);
                        return items[id];
                    },
                    add = function (newObj) {
                        items[newObj.id()] = newObj;
                    },
                    removeById = function (id) {
                        delete items[id];
                    },
                    getLocalById = function (id) {
                        // This is the only place we set to NULLO
                        return !!id && !!items[id] ? items[id] : nullo;
                    },
                    getAllLocal = function () {
                        return utils.mapMemoToArray(items);
                    },
                    getData = function (options) {
                        return $.Deferred(function (def) {
                            var results = options && options.results,
                                sortFunction = options && options.sortFunction,
                                filter = options && options.filter,
                                forceRefresh = options && options.forceRefresh,
                                param = options && options.param,
                                getFunctionOverride = options && options.getFunctionOverride;

                            getFunction = getFunctionOverride || getFunction;

                            // If the internal items object doesnt exist, 
                            // or it exists but has no properties, 
                            // or we force a refresh
                            if (forceRefresh || !items || !utils.hasProperties(items)) {
                                getFunction({
                                    success: function (dtoList) {
                                        items = mapToContext(dtoList, items, results, mapper, filter, sortFunction);
                                        def.resolve(results);
                                    },
                                    error: function (response) {
                                        //logger.error(config.toasts.errorGettingData);
                                        def.reject();
                                    }
                                }, param);
                            } else {
                                itemsToArray(items, results, filter, sortFunction);
                                def.resolve(results);
                            }
                        }).promise();
                    },
                    updateData = function (entity, callbacks) {

                        var entityJson = ko.toJSON(entity);

                        return $.Deferred(function (def) {
                            if (!updateFunction) {
                                //logger.error('updateData method not implemented');
                                if (callbacks && callbacks.error) { callbacks.error(); }
                                def.reject();
                                return;
                            }

                            updateFunction({
                                success: function (response) {
                                    //logger.success(config.toasts.savedData);
                                    entity.dirtyFlag().reset();
                                    if (callbacks && callbacks.success) { callbacks.success(); }
                                    def.resolve(response);
                                },
                                error: function (response) {
                                    //logger.error(config.toasts.errorSavingData);
                                    if (callbacks && callbacks.error) { callbacks.error(); }
                                    def.reject(response);
                                    return;
                                }
                            }, entityJson);
                        }).promise();
                    };

                return {
                    mapDtoToContext: mapDtoToContext,
                    add: add,
                    getAllLocal: getAllLocal,
                    getLocalById: getLocalById,
                    getData: getData,
                    removeById: removeById,
                    updateData: updateData
                };
            },

           //----------------------------------
            // Repositories
            //
            // Pass: 
            //  dataservice's 'get' method
            //  model mapper
            //----------------------------------
            posts = new EntitySet(dataservice.post.getPosts, modelmapper.post, model.Post.Nullo);
            //users = new EntitySet(null, modelmapper.user, model.User.Nullo, dataservice.user.updateUser);

            posts.getFullPostById = function (id, callbacks, forceRefresh) {
                return $.Deferred(function (def) {
                    var post = post.getLocalById(id);
                    if (post.isNullo || forceRefresh) {
                        // if nullo, get fresh from database
                        dataservice.post.getPost({
                            success: function (dto) {
                                // updates the user returned from getLocalById() above
                                post = posts.mapDtoToContext(dto);
                                callbacks.success(post);
                                def.resolve(dto);
                            },
                            error: function (response) {
                                logger.error('oops! could not retrieve user ' + id);
                                if (callbacks && callbacks.error) { callbacks.error(response); }
                                def.reject(response);
                            }
                        },
                        id);
                    } else {
                        callbacks.success(post);
                        def.resolve(post);
                    }
                }).promise();
            };
            
            //users.getFullUserById = function (id, callbacks, forceRefresh) {
            //    return $.Deferred(function (def) {
            //        var user = users.getLocalById(id);
            //        if (user.isNullo || forceRefresh) {
            //            // if nullo, get fresh from database
            //            dataservice.user.getUser({
            //                success: function (dto) {
            //                    // updates the user returned from getLocalById() above
            //                    user = users.mapDtoToContext(dto);
            //                    callbacks.success(user);
            //                    def.resolve(dto);
            //                },
            //                error: function (response) {
            //                    logger.error('oops! could not retrieve user ' + id);
            //                    if (callbacks && callbacks.error) { callbacks.error(response); }
            //                    def.reject(response);
            //                }
            //            },
            //            id);
            //        } else {
            //            callbacks.success(user);
            //            def.resolve(user);
            //        }
            //    }).promise();
            //};

        var datacontext = {
            posts: posts
            //,users: users
        };

        // We did this so we can access the datacontext during its construction
        model.setDataContext(datacontext);

        return datacontext;
    });