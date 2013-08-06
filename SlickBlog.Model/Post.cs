using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Model
{
    public class Post
    {
        public int Id { get; set; }
        public Blog Blog { get; set; }
        public string Title { get; set; }
        public string ContentText { get; set; }
        public Tag[] Tags { get; set; }
        public Comment[] Comments { get; set; }
    }
}