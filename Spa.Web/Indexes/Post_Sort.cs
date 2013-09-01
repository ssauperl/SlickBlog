using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Raven.Abstractions.Indexing;
using Raven.Client.Indexes;
using SlickBlog.Models;

namespace Spa.Web.Indexes
{
    public class Post_Sort: AbstractIndexCreationTask<Post>
    {
        public Post_Sort()
        {
            Map = posts => from post in posts
                           from comment in post.Comments
                           select new
                               {
                                   post.Id,
                                   comment.PostedOn
                               };

            Sort(x => x.PostedOn, SortOptions.String);
        }
    }
}