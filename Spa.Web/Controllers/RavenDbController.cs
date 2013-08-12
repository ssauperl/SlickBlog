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

namespace Spa.Web.Controllers
{
    public abstract class RavenDbController : ApiController
    {
       
        public IDocumentSession RavenSession { get; set; }
        public IDocumentStore DocumentStore { get; set; }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            if (DocumentStore == null)
                DocumentStore = MvcApplication.DocumentStore;

            if (RavenSession == null)
                RavenSession = DocumentStore.OpenSession();
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
