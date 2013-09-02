using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlickBlog.Models
{
    public class Reply
    {
        public string Id { get; set; }
        public DenormalizedUser User { get; set; }
        public DateTimeOffset PostedOn { get; set; }
        public DateTimeOffset EditedOn { get; set; }
        [Required]
        public string Content { get; set; }
    }
}
