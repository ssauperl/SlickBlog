using FlexProviders.Aspnet;
using FlexProviders.Membership;
using FlexProviders.Raven;
using FlexProviders.Roles;
using Laurelton.Web.Infrastructure.IoC;
using SlickBlog.Model;
using Microsoft.Practices.ServiceLocation;
using NinjectAdapter;

[assembly: WebActivator.PreApplicationStartMethod(typeof(SlickBlog.Web.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivator.ApplicationShutdownMethodAttribute(typeof(SlickBlog.Web.App_Start.NinjectWebCommon), "Stop")]

namespace SlickBlog.Web.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;

    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
            var kernel = bootstrapper.Kernel;
            ServiceLocator.SetLocatorProvider(() => new NinjectServiceLocator(kernel));
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
            kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

            kernel.Bind<IApplicationEnvironment>().To<AspnetEnvironment>();
            kernel.Bind<IFlexMembershipProvider<User>>().To<FlexMembershipProvider<User>>();
            kernel.Bind<IFlexRoleProvider>().To<FlexRoleProvider>();
            kernel.Bind<IFlexOAuthProvider<User>>().To<FlexMembershipProvider<User>>();

            kernel.Bind<IFlexUserStore<User>>().To<FlexMembershipUserStore<User, Role>>();
            kernel.Bind<IFlexRoleStore>().ToMethod(c => (IFlexRoleStore)c.Kernel.Get<IFlexUserStore<User>>());

            RegisterServices(kernel);
            return kernel;
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Load<RavenModule>();
        }
    }
}
