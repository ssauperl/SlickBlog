using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Spa.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //config.Routes.MapHttpRoute(
            //    name: "CommentsRoute",
            //    routeTemplate: "api/{controller}/{postId}/{commentId}",
            //    defaults: new { postId = RouteParameter.Optional,
            //                    commentId = RouteParameter.Optional
            //    }
            //);

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional,
                                id2 = RouteParameter.Optional
                }
            );
        }
    }
}
