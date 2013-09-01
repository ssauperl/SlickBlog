using FlexProviders.Membership;
using FlexProviders.Roles;
using Ninject;
using Raven.Client;
using Raven.Client.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using SlickBlog.Models;

namespace Spa.Web.Controllers
{
    public abstract class RavenDbController : ApiController
    {
        [Inject]
        public IDocumentSession RavenSession { get; set; }
        [Inject]
        public IDocumentStore RavenStore { get; set; }
        [Inject]
        public IFlexUserStore<User> FlexUserStore { get; set; }
        [Inject]
        public IFlexRoleProvider FlexRoleProvider { get; set; }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            // Prevent data override. Handle "ConcurrencyException" on "RavenSession.SaveChanges();" call.
            RavenSession.Advanced.UseOptimisticConcurrency = true;
        }
    }
}
