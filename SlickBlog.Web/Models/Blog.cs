using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlickBlog.Web.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public User[] Users { get; set; }
        public string Name { get; set; }
        public string[] Tags { get; set; }
    }
}