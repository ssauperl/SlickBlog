[assembly: WebActivator.PreApplicationStartMethod(typeof(Spa.Web.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivator.ApplicationShutdownMethodAttribute(typeof(Spa.Web.App_Start.NinjectWebCommon), "Stop")]

namespace Spa.Web.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;
    using FlexProviders.Membership;
    using FlexProviders.Roles;
    using FlexProviders.Raven;
    using FlexProviders.Aspnet;
    using SlickBlog.Models;
    using System.Web.Http;
    using Spa.Web.DependencyResolution;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();
        //private static IKernel _kernel { get; set; }


        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
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


            //init membership
            kernel.Bind<IApplicationEnvironment>().To<AspnetEnvironment>();
            kernel.Bind<IFlexMembershipProvider<User>>().To<FlexMembershipProvider<User>>();
            kernel.Bind<IFlexRoleProvider>().To<FlexRoleProvider>();
            kernel.Bind<IFlexOAuthProvider<User>>().To<FlexMembershipProvider<User>>();
            kernel.Bind<IFlexUserStore<User>>().To<FlexMembershipUserStore<User, Role>>();
            kernel.Bind<IFlexRoleStore>().ToMethod(c => (IFlexRoleStore)c.Kernel.Get<IFlexUserStore<User>>());


            // Install our Ninject-based IDependencyResolver into the Web API config
            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);


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

            // We load WebApiConfig here because it requires FlexMembershipProvider dependency
            var webApiConfig = new WebApiConfig(kernel.Get<IFlexMembershipProvider<User>>());
            webApiConfig.Register(GlobalConfiguration.Configuration);
        }        
    }
}
