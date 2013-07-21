using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Web.Models
{
    public class Comment
    {
        public User User { get; set; }
        public string Content { get; set; }
    }
}