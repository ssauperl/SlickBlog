using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Web.Models
{
    public class Post
    {
        public int Id { get; set; }
        public Blog Blog { get; set; }
        public string Title { get; set; }
        public string ContentText { get; set; }
        public string[] Tags { get; set; }
        public Comment Comments { get; set; }
    }
}