/** 
    * @module Confirm an external login
    * @requires appsecurity
    * @requires router
    * @requires utils
    * @requires errorHandler
*/

define(['services/appsecurity', 'plugins/router', 'services/utils', 'services/errorhandler'],
function (appsecurity, router, utils, errorhandler) {

    var displayName = ko.observable(),
        userName = ko.observable().extend({ required: true }),
        email = ko.observable().extend({ required: true, email: true }),
        externalLoginData = ko.observable(),
        returnUrl = ko.observable();

    var viewmodel = {
        /** @property {observable} DisplayName */
        DisplayName: displayName,
        
        /** @property {observable} UserName */
        userName: userName,
        
        /** @property {observable} Email - Email for the new user */
        email: email,

        /** @property {observable} ExternalLoginData - External login data from the provider */
        externalLoginData: externalLoginData,
        
        /** @property {observable} ReturnUrl - Return url for the success external login */
        returnUrl: returnUrl,

        /**
         * Activate view
         * @method
        */
        activate: function() {
            var self = this;
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            return appsecurity.getExternalLoginConfirmationData(utils.getURLParameter("returnurl"),
                utils.getURLParameter("username"),
                utils.getURLParameter("provideruserid"),
                utils.getURLParameter("provider"))
                .then(function(data) {
                    self.DisplayName(data.DisplayName);
                    self.userName(data.userName.split("@")[0]);
                    self.email(data.userName);
                    self.externalLoginData(data.externalLoginData);
                    self.returnUrl(data.returnUrl);
                }).fail(self.handlevalidationerrors);
        },
        
        /**
         * Confirm an exernal account
         * @method
        */
        confirmexternalaccount: function() {
            var self = this;
            if (this.errors().length != 0) {
                this.errors.showAllMessages();
                return;
            }
            appsecurity.confirmExternalAccount(self.DisplayName(), self.userName(), self.email(), self.externalLoginData())
                .then(function(data) {
                    router.navigate("/#/" + self.ReturnUrl());
                }).fail(self.handlevalidationerrors);
        }
    };
    
    errorhandler.includeIn(viewmodel);
    
    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;

});