using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using FlexProviders.Membership;

namespace SlickBlog.Models
{
    public class User : IFlexMembershipUser
    {
        public User()
        {
            OAuthAccounts = new Collection<FlexOAuthAccount>();
        }

        public string Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Salt { get; set; }
        public string PasswordResetToken { get; set; }
        public DateTime PasswordResetTokenExpiration { get; set; }
        public virtual ICollection<FlexOAuthAccount> OAuthAccounts { get; set; }
    }
}