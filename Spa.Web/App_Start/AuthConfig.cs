using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.WebPages.OAuth;
using System.Configuration;
using FlexProviders.Membership;
using SlickBlog.Model;
using DotNetOpenAuth.AspNet.Clients;

namespace Spa.Web.App_Start
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            //OAuthWebSecurity.RegisterTwitterClient(
            //    consumerKey:  ConfigurationManager.AppSettings["TwitterKey"],
            //    consumerSecret: ConfigurationManager.AppSettings["TwitterSecret"]);

            //OAuthWebSecurity.RegisterFacebookClient(
            //    appId: ConfigurationManager.AppSettings["FacebookKey"],
            //    appSecret: ConfigurationManager.AppSettings["FacebookSecret"]);

            //OAuthWebSecurity.RegisterGoogleClient();
           
            //FlexMembershipProvider<User>.RegisterClient(
            //    new TwitterClient(ConfigurationManager.AppSettings["TwitterKey"],
            //        ConfigurationManager.AppSettings["TwitterSecret"]), "Twitter", new Dictionary<string, object>());

            //FlexMembershipProvider<User>.RegisterClient(
            //   new FacebookClient(ConfigurationManager.AppSettings["FacebookKey"],
            //       ConfigurationManager.AppSettings["FacebookSecret"]), "Facebook", new Dictionary<string, object>());

            //FlexMembershipProvider<User>.RegisterClient(
            //    new MicrosoftClient(ConfigurationManager.AppSettings["MicrosoftKey"],
            //        ConfigurationManager.AppSettings["MicrosoftSecret"]), "Microsoft", new Dictionary<string, object>());

            FlexMembershipProvider<User>.RegisterClient(
            new GoogleOpenIdClient(),
            "Google", new Dictionary<string, object>());

            //Dictionary<string, object> MicrosoftsocialData = new Dictionary<string, object>();
            //MicrosoftsocialData.Add("Icon", "../Content/icons/microsoft.png");
            //OAuthWebSecurity.RegisterClient(new MicrosoftScopedClient(ConfigurationManager.AppSettings["MicrosoftKey"], 
            //                                                          ConfigurationManager.AppSettings["MicrosoftSecret"],
            //                                                          "wl.basic wl.emails"), "Microsoft", MicrosoftsocialData);
        }
    }
}
