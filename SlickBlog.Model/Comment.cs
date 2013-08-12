using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Model
{
    public class Comment
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }
        public string ReplyTo { get; set; }
    }
}