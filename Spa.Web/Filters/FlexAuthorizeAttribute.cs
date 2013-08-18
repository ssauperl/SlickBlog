using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using FlexProviders.Roles;
using System.Web.Http.Controllers;
using System.Web.Http;

namespace Spa.Web.Filters
{
    public class FlexAuthorizeAttribute : AuthorizeAttribute
    {     
        public override void OnAuthorization(HttpActionContext  actionContext)
        {
            var user = Thread.CurrentPrincipal;
            if (!user.Identity.IsAuthenticated)
            {
                HandleUnauthorizedRequest(actionContext);
                return;
            }

            if (_usersSplit.Length > 0)
            {
                if (_usersSplit.Contains(user.Identity.Name, StringComparer.OrdinalIgnoreCase))
                {
                    return;
                }
            }

            if (_rolesSplit.Length > 0)
            {
                var roleProvider = (IFlexRoleProvider)GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(IFlexRoleProvider));
                if (_rolesSplit.Any(role => roleProvider.IsUserInRole(user.Identity.Name, role)))
                {
                    return;
                }
            }

            if(_rolesSplit.Length > 0 || _usersSplit.Length > 0)
            {
                HandleUnauthorizedRequest(actionContext);    
            }            
        }

        public new string Roles
        {
            get
            {
                return _roles ?? string.Empty;
            }
            set
            {
                _roles = value;
                _rolesSplit = SplitString(value);
            }
        }    

        public new string Users
        {
            get
            {
                return _users ?? string.Empty;
            }
            set
            {
                _users = value;
                _usersSplit = SplitString(value);
            }
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
        }

        private string[] SplitString(string original)
        {
            return original.Split(',').Select(s => s.Trim()).ToArray();
        }

        private string[] _rolesSplit = new string[0];
        private string[] _usersSplit = new string[0];
        private string _roles;
        private string _users;
    }
}