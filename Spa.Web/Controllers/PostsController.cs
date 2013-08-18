using SlickBlog.Model;
using System.Collections.Generic;
using System.Web.Http;
using Spa.Web.Filters;

namespace Spa.Web.Controllers
{
    public class PostsController : RavenDbController
    {
        // GET api/posts
        [AllowAnonymous]
        public IEnumerable<Post> Get()
        {

            var posts = RavenSession.Query<Post>();
            return posts;
        }

        // GET api/posts/5
        [AllowAnonymous]
        public Post Get(string id)
        {

            var post = RavenSession.Load<Post>(id);
            return post;

        }

        // POST api/posts
        [FlexAuthorize(Roles = "admin")]
        [AntiForgeryToken]
        public string Post([FromBody]Post post)
        {
            post.Id = null;
            RavenSession.Store(post);
            return RavenSession.Advanced.GetDocumentId(post);
        }

        // PUT api/posts/5
        [FlexAuthorize(Roles = "admin")]
        [AntiForgeryToken]
        public void Put(string id, [FromBody]Post updatedPost)
        {
            //TODO
            var post = RavenSession.Load<Post>(id);
            post.Title = updatedPost.Title;
            post.ContentText = updatedPost.ContentText;
            post.Tags = updatedPost.Tags;

        }

        // DELETE api/posts/5
        public void Delete(string id)
        {
            var post = RavenSession.Load<Post>(id);
            RavenSession.Delete(post);
        }

    }
}