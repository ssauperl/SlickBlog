﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SlickBlog.Models
{
    public class Comment
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTimeOffset PostedOn { get; set; }
        public DateTimeOffset EditedOn { get; set; }
        [Required]
        public string Content { get; set; }
        public Reply[] Replies { get; set; }
    }
}