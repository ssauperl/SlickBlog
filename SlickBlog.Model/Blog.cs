using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Model
{
    public class Blog
    {
        public string Id { get; set; }
        public string[] Users { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string[] Tags { get; set; }
    }
}