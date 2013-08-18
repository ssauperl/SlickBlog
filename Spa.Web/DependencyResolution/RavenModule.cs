using System;
using System.Configuration;
using FlexProviders.Aspnet;
using FlexProviders.Membership;
using FlexProviders.Raven;
using FlexProviders.Roles;
using SlickBlog.Model;
using Ninject;
using Ninject.Activation;
using Ninject.Modules;
using Ninject.Web.Common;
using Raven.Client;
using Raven.Client.Document;
namespace Spa.Web.DependencyResolution
{
    public class RavenModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IDocumentStore>()
                .ToMethod(InitDocStore)
                .InSingletonScope();

            Bind<IDocumentSession>()
                .ToMethod(c => c.Kernel.Get<IDocumentStore>().OpenSession())
                .InRequestScope();
        }

        private IDocumentStore InitDocStore(IContext context)
        {
            IDocumentStore ds =
                new DocumentStore { ConnectionStringName = "RavenDB" }.Initialize();


            ds.Conventions.IdentityPartsSeparator = "-";
            CheckForCoreData(ds, context);
            return ds;
        }

        private void CheckForCoreData(IDocumentStore ds, IContext context)
        {
            // In case the versioning bundle is installed, make sure it will version
            // only what we opt-in to version
            using (IDocumentSession s = ds.OpenSession())
            {
                var store = new FlexMembershipUserStore<User, Role>(s);

                var membership = new FlexMembershipProvider<User>(store, new AspnetEnvironment());
                var roles = new FlexRoleProvider(store);
                if (!membership.HasLocalAccount("admin"))
                {
                    membership.CreateAccount(new User { Username = "admin", Password = "sparocks" });
                }
                if (!roles.RoleExists(ConfigurationManager.AppSettings["AdminRole"]))
                {
                    roles.CreateRole(ConfigurationManager.AppSettings["AdminRole"]);
                
                }
                if (!roles.RoleExists(ConfigurationManager.AppSettings["DefaultRole"]))
                {
                    roles.CreateRole(ConfigurationManager.AppSettings["DefaultRole"]);
                }
                if (!roles.IsUserInRole("admin", ConfigurationManager.AppSettings["AdminRole"]))
                {
                    roles.AddUsersToRoles(new[] { "admin" }, new[] { ConfigurationManager.AppSettings["AdminRole"] });
                }
                if (!roles.IsUserInRole("admin", ConfigurationManager.AppSettings["DefaultRole"]))
                {
                    roles.AddUsersToRoles(new[] { "admin" }, new[] { ConfigurationManager.AppSettings["DefaultRole"] });
                }


            }
        }
    }
}