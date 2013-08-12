using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Model
{
    public class Post
    {
        public string Id { get; set; }
        public string BlogId { get; set; }
        public string Title { get; set; }
        public string ContentText { get; set; }
        public string[] Tags { get; set; }
        public Comment[] Comments { get; set; }
    }
}