using SlickBlog.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Spa.Web.Controllers
{
    public class PostsController : RavenDbController
    {
        // GET api/posts
        public IEnumerable<Post> Get()
        {

            var posts = RavenSession.Query<Post>();
            return posts;
        }

        // GET api/posts/5
        public Post Get(string id)
        {

            var post = RavenSession.Load<Post>(FormatId(id));
            return post;

        }

        // POST api/posts
        public string Post([FromBody]Post post)
        {
            RavenSession.Store(post);
            return RavenSession.Advanced.GetDocumentId(post).Replace("posts/", "");
        }

        // PUT api/posts/5
        public void Put(string id, [FromBody]Post updatedPost)
        {
            //TODO
            var post = RavenSession.Load<Post>(FormatId(id));
            post.Title = updatedPost.Title;
            post.ContentText = updatedPost.ContentText;
            post.Tags = updatedPost.Tags;

        }

        // DELETE api/posts/5
        public void Delete(string id)
        {
            var post = RavenSession.Load<Post>(FormatId(id));
            RavenSession.Delete(post);
        }

        private string FormatId(string id)
        {
            return "posts/" + id;
        }
    }
}