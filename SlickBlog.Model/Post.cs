using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SlickBlog.Models
{
    public class Post
    {
        public string Id { get; set; }
        public DenormalizedUser User { get; set; }
        public DateTimeOffset PostedOn { get; set; }
        public DateTimeOffset EditedOn { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        public string[] Tags { get; set; }
        public Comment[] Comments { get; set; }
    }
}