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

        // GET api/<controller>/5
        public Post Get(string id)
        {

            var post = RavenSession.Load<Post>("posts/"+id);
            return post;

        }

        // POST api/<controller>
        public void Post([FromBody]Post post)
        {
            RavenSession.Store(post);
        }

        // PUT api/<controller>/5
        public void Put(string id, [FromBody]Post updatedPost)
        {
            //TODO
            var post = RavenSession.Load<Post>("posts/" + id);
            post.Title = updatedPost.Title;
            post.ContentText = updatedPost.ContentText;

        }

        // DELETE api/<controller>/5
        public void Delete(string id)
        {
            var post = RavenSession.Load<Post>("posts/" + id);
            RavenSession.Delete(post);
        }
    }
}