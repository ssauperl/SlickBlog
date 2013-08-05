using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Model
{
    public class Comment
    {
        public User User { get; set; }
        public string Content { get; set; }
        public Comment[] Replies { get; set; }
    }
}