using FlexProviders.Membership;
using System.Web.Http;
using SlickBlog.Model;
using Thinktecture.IdentityModel.Http.Cors.WebApi;
using Thinktecture.IdentityModel.Tokens.Http;

namespace Spa.Web.App_Start
{
    public class WebApiConfig
    {
        private readonly IFlexMembershipProvider<User> _membershipProvider;

        public WebApiConfig(IFlexMembershipProvider<User> membership)
        {
            _membershipProvider = membership;
        }

        public void Register(HttpConfiguration config)
        {
            //config.Routes.MapHttpRoute(
            //    name: "CommentsRoute",
            //    routeTemplate: "api/{controller}/{postId}/{commentId}",
            //    defaults: new { postId = RouteParameter.Optional,
            //                    commentId = RouteParameter.Optional
            //    }
            //);

            config.Routes.MapHttpRoute(
                name: "AccountApi",
                routeTemplate: "api/account/{action}/{id}",
                defaults: new { controller = "Account", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional,
                                id2 = RouteParameter.Optional
                }
            );

            // Basic Authentication and Cors support with Thinktecture Identity model
            ConfigureBasicAuth(config);

            ConfigureCors(config);    
        }

        private void ConfigureBasicAuth(HttpConfiguration config)
        {
            var authConfig = new AuthenticationConfiguration
            {
                InheritHostClientIdentity = true, // Inherit authentication from Forms
                EnableSessionToken = true, // Enable Session Tokens
                RequireSsl = false, // Remember to change in Production
                SendWwwAuthenticateResponseHeaders = false // Prevent browser window to show
            };

            // setup authentication against membership
            authConfig.AddBasicAuthentication((userName, password) =>
               _membershipProvider.Login(userName, password, false));

            config.MessageHandlers.Add(new AuthenticationHandler(authConfig));
        }

        private void ConfigureCors(HttpConfiguration config)
        {
            var corsConfig = new WebApiCorsConfiguration();
            config.MessageHandlers.Add(new CorsMessageHandler(corsConfig, config));

            corsConfig
                .ForAllOrigins()
                .AllowAllMethods()
                .AllowAllRequestHeaders();
        }
    }
}
