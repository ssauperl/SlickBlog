using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SlickBlog.Model
{
    public class Comment
    {
        public string Id { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Content { get; set; }
        public string ReplyTo { get; set; }
    }
}