using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Security;
using System.Threading;
using FlexProviders.Membership;
using SlickBlog.Models;
using FlexProviders.Roles;
using System.Configuration;
using System.Linq;
using System.Transactions;
using Spa.Web.Filters;


namespace Spa.Web.Controllers{

    public class AccountController: ApiController
    {
        private readonly IFlexMembershipProvider<User> _membershipProvider;
        private readonly IFlexOAuthProvider<User> _oAuthProvider;
        private readonly IFlexRoleProvider _roleProvider;
        private readonly ISecurityEncoder _encoder = new DefaultSecurityEncoder();
        private readonly IFlexUserStore<User> _userStore;


        /// <summary>
        /// This controller provide the authentication api for the entire application
        /// </summary>
        public AccountController(IFlexMembershipProvider<User> membership, IFlexOAuthProvider<User> oauth, IFlexRoleProvider roles, IFlexUserStore<User> userStore) {
            _membershipProvider = membership;
            _oAuthProvider = oauth;
            _roleProvider = roles;
            _userStore = userStore;
        }

        /// <summary>
        /// Sign in user
        /// </summary>
        /// <param name="credential">User credentials</param>
        /// <returns>Authenticathion object containing the result of this operation</returns>
        [HttpPost]
        [HttpOptions]
        [AllowAnonymous]
        public UserInfo Login(Credential credential)
        {
            // try to sign in
            if (_membershipProvider.Login(credential.UserName, credential.Password, credential.RememberMe))
            {
                // Create a new Principal and return authenticated                
                IPrincipal principal = new GenericPrincipal(new GenericIdentity(credential.UserName), _roleProvider.GetRolesForUser(credential.UserName));
                Thread.CurrentPrincipal = principal;
                HttpContext.Current.User = principal;
                var user = _userStore.GetUserByUsername(credential.UserName);
                return new UserInfo
                {
                    UserId = user.Id,
                    IsAuthenticated = true,
                    UserName = credential.UserName,
                    Roles = _roleProvider.GetRolesForUser(credential.UserName)
                };
            }
            // if you get here => return 401 Unauthorized
            var errors = new Dictionary<string, IEnumerable<string>>();
            errors.Add("Authorization", new string[] { "The supplied credentials are not valid" });
            throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.Unauthorized, errors));
        }

        /// <summary>
        /// Sign out the authenticated user
        /// </summary>
        /// <returns>Authenticathion object containing the result of the sign out operation</returns>
        [HttpPost]
        [AntiForgeryToken]
        [HttpOptions]
        public UserInfo Logout()
        {
            // Try to sign out
            try
            {
                _membershipProvider.Logout();
                Thread.CurrentPrincipal = null;
                HttpContext.Current.User = null;
            }
            catch (MembershipCreateUserException e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message));
            }
            // return user not already authenticated
            return new UserInfo
            {
                UserId = "",
                IsAuthenticated = false,
                UserName = "",
                Roles = new string[] { }
            };
        }

        /// <summary>
        /// Register a new account using the Membership system
        /// </summary>
        /// <param name="model">Register model</param>
        /// <returns>Authenticathion object containing the result of the register operation</returns>
        [HttpPost]
        [AllowAnonymous]
        [AntiForgeryToken]
        public UserInfo Register(RegisterModel model)
        {
            try
            {
                var user = new User { Username = model.UserName, Email = model.Email, Password = model.Password };
                _membershipProvider.CreateAccount(user);
                _membershipProvider.Login(model.UserName, model.Password);
                _roleProvider.AddUsersToRoles(new string[] { model.UserName }, new string[] { ConfigurationManager.AppSettings["DefaultRole"] });

                IPrincipal principal = new GenericPrincipal(new GenericIdentity(model.UserName), _roleProvider.GetRolesForUser(model.UserName));
                Thread.CurrentPrincipal = principal;
                HttpContext.Current.User = principal;
                
                return new UserInfo()
                {
                    UserId = _userStore.GetUserByUsername(model.UserName).Id,
                    IsAuthenticated = true,
                    UserName = model.UserName,
                    Roles = new string[] { ConfigurationManager.AppSettings["DefaultRole"] }
                };
            }
            catch (MembershipCreateUserException e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message));
            }
        }

        /// <summary>
        /// Get the actual authentication status
        /// </summary>
        /// <returns>User authentication object</returns>
        [HttpGet]
        [AllowAnonymous]
        public UserInfo UserInfo()
        {
            if (User.Identity.IsAuthenticated)
            {
                return new UserInfo
                {
                    UserId = _userStore.GetUserByUsername(User.Identity.Name).Id,
                    IsAuthenticated = true,
                    UserName = User.Identity.Name,
                    Roles = _roleProvider.GetRolesForUser(User.Identity.Name)
                };
            }
            else
            {
                return new UserInfo
                {
                    IsAuthenticated = false
                };
            }
        }

        /// <summary>
        /// Get the list of external logins
        /// Configured in App_Start
        /// </summary>
        /// <returns>A list with the admitted providers</returns>
        [HttpGet]
        [AllowAnonymous]
        public IEnumerable<ExternalLogin> ExternalLoginsList()
        {
            var externalLogins = new List<ExternalLogin>();
            foreach (var client in _oAuthProvider.RegisteredClientData)
            {
                externalLogins.Add(new ExternalLogin
                {
                    Provider = client.AuthenticationClient.ProviderName,
                    ProviderDisplayName = client.DisplayName
                });
            }
            return externalLogins;
        }

        /// <summary>
        /// Start a external login operation with the configured oAuth providers
        /// </summary>
        /// <param name="provider">User selected provider</param>
        /// <param name="returnUrl">The return url to this domain</param>
        /// <returns>http response code</returns>
        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage ExternalLogin(string provider, string returnUrl)
        {
            try
            {
                // Start oAuth authentication and call the ExternalLoginCallback when returning to this domain
                _oAuthProvider.RequestOAuthAuthentication(provider, "/api/account/ExternalLoginCallback?returnurl=" + returnUrl);
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.InnerException.Message));
            }

        }

        /// <summary>
        /// This method will be called when returning from the provider oAuth 
        /// system to get the authentication result data
        /// </summary>
        /// <param name="returnUrl">The return url (Set up in ExternalLogin start method)</param>
        /// <returns>http response</returns>
        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage ExternalLoginCallback(string returnUrl)
        {
            try
            {
                //AuthenticationResult result = OAuthWebSecurity.VerifyAuthentication();
                var result = _oAuthProvider.VerifyOAuthAuthentication(returnUrl);
                if (!result.IsSuccessful)
                {
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/externalloginfailure");
                    return response;
                }

                if (_oAuthProvider.OAuthLogin(result.Provider, result.ProviderUserId, false))
                {
                    IPrincipal principal = new GenericPrincipal(new GenericIdentity(result.ProviderUserId), null);
                    Thread.CurrentPrincipal = principal;
                    HttpContext.Current.User = principal;
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/" + returnUrl);
                    return response;
                }

                if (User.Identity.IsAuthenticated)
                {
                    // If the current user is logged in add the new account
                    // TODO This probably overrides user data with username (check it)
                    _oAuthProvider.CreateOAuthAccount(result.Provider, result.ProviderUserId, new User() { Username = User.Identity.Name });
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/" + returnUrl);
                    return response;
                }
                else
                {
                    // User is new, ask for their desired membership name

                    // We could send serialized data in response...
                    var loginData = _encoder.SerializeOAuthProviderUserId(result.Provider, result.ProviderUserId);

                    // ...but we exstract it manualy
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/externalloginconfirmation?returnurl=" + returnUrl + "&username=" + result.UserName + "&provideruserid=" + result.ProviderUserId + "&provider=" + result.Provider);
                    return response;
                }
            }
            catch (Exception ex)
            {
                var response = Request.CreateResponse(HttpStatusCode.Redirect);
                response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/externalloginfailure");
                return response;
            }
        }

        /// <summary>
        /// Get data to confirm the external login account
        /// </summary>
        /// <param name="returnUrl">url to return</param>
        /// <param name="username">username</param>
        /// <param name="provideruserid">the provider user id</param>
        /// <param name="provider">The oAuth provider</param>
        /// <returns>Data to register the external account</returns>
        [HttpGet]
        [AllowAnonymous]
        public RegisterExternalLoginModel ExternalLoginConfirmation(string returnUrl, string username, string provideruserid, string provider)
        {
            var model = new RegisterExternalLoginModel();
            if (!User.Identity.IsAuthenticated)
            {
                // User is new, ask for their desired membership name
                string loginData = _encoder.SerializeOAuthProviderUserId(provider, provideruserid);
                model.UserName = username;
                model.Email = username;//TODO Check if this is alright, we probably need email here
                model.DisplayName = _oAuthProvider.GetOAuthClientData(provider).DisplayName;
                model.ReturnUrl = returnUrl;
                model.ExternalLoginData = loginData;
            }
            return model;
        }

        /// <summary>
        /// End external registration
        /// </summary>
        /// <param name="model">External model object</param>
        /// <returns>Authentication object with the result</returns>
        [HttpPost]
        [AntiForgeryToken]
        [AllowAnonymous]
        public UserInfo RegisterExternalLogin(RegisterExternalLoginModel model)
        {
            string provider = null;
            string providerUserId = null;

            if (User.Identity.IsAuthenticated || !_encoder.TryDeserializeOAuthProviderUserId(model.ExternalLoginData, out provider, out providerUserId))
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is already authenticated"));
            }

            // Insert a new user into the database
            //var user =  RavenSession.Query<User>().FirstOrDefault(u => u.Username.ToLower() == model.UserName.ToLower());

            // Check if user already exists
            if (!_membershipProvider.Exists(model.UserName))
            {
                // Insert name into the profile table
                //UnitOfWork.UserProfileRepository.Add(new UserProfile { UserName = model.UserName, Email = model.Email });
                //UnitOfWork.Commit();
                _oAuthProvider.CreateOAuthAccount(provider, providerUserId, new User() { Username = model.UserName, Email = model.Email});
                _oAuthProvider.OAuthLogin(provider, providerUserId, false);

                _roleProvider.AddUsersToRoles(new string[] { model.UserName }, new string[] { ConfigurationManager.AppSettings["DefaultRole"] });

                IPrincipal principal = new GenericPrincipal(new GenericIdentity(model.UserName), new string[] { ConfigurationManager.AppSettings["DefaultRole"] });
                Thread.CurrentPrincipal = principal;
                HttpContext.Current.User = principal;

                return new UserInfo()
                {
                    UserId = _userStore.GetUserByUsername(model.UserName).Id,
                    IsAuthenticated = true,
                    Roles = new string[] { ConfigurationManager.AppSettings["DefaultRole"] },
                    UserName = model.UserName
                };
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User name already exists. Please enter a different user name"));
            }
        }

        /// <summary>
        /// Check if the oAuth user has already a local account
        /// </summary>
        /// <returns>bool</returns>
        [HttpGet]
        public bool HasLocalAccount()
        {
            return _membershipProvider.HasLocalAccount(User.Identity.Name);
        }

        /// <summary>
        /// Change the password of the authenticated user
        /// </summary>
        /// <param name="model">The change password model</param>
        /// <returns>http response</returns>
        [HttpPost]
        [AntiForgeryToken]
        public HttpResponseMessage ChangePassword(ChangePasswordModel model)
        {
            bool changePasswordSucceeded;
            if (!ModelState.IsValid)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "Password and confirmation should match"));
            try
            {
                changePasswordSucceeded = _membershipProvider.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword);
            }
            catch (Exception)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Unable to change the password"));
            }

            if (changePasswordSucceeded)
            {
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            
            throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "The current password is incorrect or the new password is invalid."));
        }

        /// <summary>
        /// Creates a new local account for a user authenticated with any external provider
        /// </summary>
        /// <param name="model">The model</param>
        /// <returns>http response</returns>
        [HttpPost]
        [AntiForgeryToken]
        public HttpResponseMessage CreateLocalAccount(CreateLocalAccountModel model)
        {
            if (!ModelState.IsValid)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "Password and confirmation should match"));
            try
            {
                var user = _userStore.GetUserByUsername(User.Identity.Name);
                // We set new password to the existing account
                user.Password = model.NewPassword;
                _membershipProvider.UpdateAccount(user);
                
                // TODO: It was done this way in sample contoller. Needs to be checked.
                //_membershipProvider.CreateAccount(new User() { Username = User.Identity.Name, Password = model.NewPassword });
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message));
            }
            throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Password and confirmation should match"));
        }

        /// <summary>
        /// Get antiforgery tokens
        /// </summary>
        /// <returns>the anti forgery token</returns>
        [HttpGet]
        [AllowAnonymous]
        public string GetAntiForgeryTokens()
        {
            string cookieToken = "", formToken = "";
            AntiForgery.GetTokens(null, out cookieToken, out formToken);
            var httpCookie = HttpContext.Current.Response.Cookies[AntiForgeryConfig.CookieName];
            if (httpCookie != null)
                httpCookie.Value = cookieToken;
            return formToken;
        }

        /// <summary>
        /// Get the registered external logins list
        /// </summary>
        /// <returns>External Login List</returns>
        [HttpGet]
        public ExternalAccounts ExternalAccounts()
        {

            var accounts = _oAuthProvider.GetOAuthAccountsFromUserName(User.Identity.Name);
            var externalLogins = new List<ExternalLogin>();
            foreach (var account in accounts)
            {
                var clientData = _oAuthProvider.GetOAuthClientData(account.Provider);

                externalLogins.Add(new ExternalLogin
                {
                    Provider = account.Provider,
                    ProviderDisplayName = clientData.DisplayName,
                    ProviderUserId = account.ProviderUserId,
                });
            }
            var externalLoginList = new ExternalAccounts();
            externalLoginList.ExternalLogins = externalLogins;
            externalLoginList.ShowRemoveButton = externalLogins.Count > 1 || _membershipProvider.HasLocalAccount(User.Identity.Name);
            return externalLoginList;
        }

        /// <summary>
        /// Dissasociate an external account
        /// </summary>
        /// <returns>http response</returns>
        [HttpPost]
        [AntiForgeryToken]
        public HttpResponseMessage Disassociate(DissasociateModel model)
        {
            var ownerAccount = _userStore.GetUserByOAuthProvider(model.Provider, model.ProviderUserId).Username;
            // Dissasociate account if authenticated user is the owner
            if (ownerAccount == User.Identity.Name)
            {
                var hasLocalAccount = _membershipProvider.HasLocalAccount(User.Identity.Name);
                if (hasLocalAccount || _oAuthProvider.GetOAuthAccountsFromUserName(User.Identity.Name).Count() > 1)
                {
                    _oAuthProvider.DisassociateOAuthAccount(model.Provider, model.ProviderUserId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Account succesfully dissasociated");
                }
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You cannot disassociate the last linked account"));
            }
            throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You are not the account owner"));
        }
       
    }
}
