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

namespace SlickBlog.Web.Controllers
{
    public abstract class RavenDbAPIController : ApiController
    {
       
        public IDocumentSession RavenSession { get; set; }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            if (RavenSession == null)
                RavenSession = MvcApplication.DocumentStore.OpenSession();
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            using (RavenSession)
            {
                if (RavenSession != null)
                    RavenSession.SaveChanges();
            }
        }
    }
}
