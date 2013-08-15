using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Optimization;
using Microsoft.Practices.ServiceLocation;
using Ninject;
using Raven.Client;
using Raven.Client.Document;
using Spa.Web.App_Start;
using Thinktecture.IdentityModel.Tokens.Http;
using FlexProviders.Raven;
using FlexProviders.Membership;
using FlexProviders.Roles;
using SlickBlog.Model;
using FlexProviders.Aspnet;
namespace Spa.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            // WebApiConfig is loaded in NinjectWebCommon
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth(); 

            InitializeDocumentStore();
        }



        //TODO resolve this with dependecy injection
        public static IDocumentStore DocumentStore { get; private set; }

        private static void InitializeDocumentStore()
        {
            if (DocumentStore != null) return; // prevent misuse

            DocumentStore = new DocumentStore
            {
                ConnectionStringName = "RavenDB"
            }.Initialize();
            DocumentStore.Conventions.IdentityPartsSeparator = "-";
        }



      
    }
}