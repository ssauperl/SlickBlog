using System;
using System.Net;
using System.Net.Http;
using System.Linq;
using System.Web.UI.WebControls;
using Raven.Client;
using SlickBlog.Models;
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
            var posts = RavenSession.Query<Post>().Customize(x => x.Include<Post>(p => p.UserId)).OrderByDescending(post => post.PostedOn);
            foreach (var post in posts)
            {
                // this will not require querying the server!
                var cust = RavenSession.Load<User>(post.UserId);
            }
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
            // We need to make sure Id is null, if string is empty raven will generate guid as id (we don't want that)
            post.Id = null;
            var user = FlexUserStore.GetUserByUsername(User.Identity.Name);
            post.UserId = user.Id;
            post.PostedOn = DateTime.UtcNow;
            RavenSession.Store(post);
            RavenSession.SaveChanges();

            return RavenSession.Advanced.GetDocumentId(post);
        }

        // PUT api/posts/5
        [FlexAuthorize(Roles = "admin")]
        [AntiForgeryToken]
        public void Put(string id, [FromBody]Post updatedPost)
        {
            if (!ModelState.IsValid)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "Title and content are required"));

            var post = RavenSession.Load<Post>(id);
            var user =  FlexUserStore.GetUserByUsername(User.Identity.Name);
            post.UserId = user.Id;
            post.Title = updatedPost.Title;
            post.Content = updatedPost.Content;
            post.Tags = updatedPost.Tags;
            post.EditedOn = DateTime.UtcNow;

            RavenSession.SaveChanges();
        }

        // DELETE api/posts/5
        [FlexAuthorize(Roles = "admin")]
        [AntiForgeryToken]
        public void Delete(string id)
        {
            var post = RavenSession.Load<Post>(id);
            RavenSession.Delete(post);
            RavenSession.SaveChanges();
        }

    }
}