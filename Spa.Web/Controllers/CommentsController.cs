using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Microsoft.Ajax.Utilities;
using Raven.Abstractions.Exceptions;
using Raven.Client.Indexes;
using SlickBlog.Models;
using Raven.Abstractions.Data;
using Raven.Json.Linq;
using Raven.Client.Document;
using Spa.Web.Filters;
namespace Spa.Web.Controllers
{
    public class CommentsController : RavenDbController
    {

        // GET api/comments/postId/commentId
        public Comment Get(string id, string subid)
        {
            try
            {
                return RavenSession.Load<Post>(id).Comments.Single(c => c.Id == subid);
            }
            catch (ArgumentNullException)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                   "Comment not found"));
            }
        }

        // POST api/comments/postId
        [FlexAuthorize(Roles = "admin, user")]
        [AntiForgeryToken]
        public string Post(string id, [FromBody] Comment comment)
        {
            var user = FlexUserStore.GetUserByUsername(User.Identity.Name);

       
            if (!comment.Id.IsNullOrWhiteSpace())
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Use PUT to update existing comment"));

                var documentSession = (DocumentSession)RavenSession;
                comment.Id = RavenStore.Conventions.GenerateDocumentKey(documentSession.DatabaseName,
                    documentSession.DatabaseCommands, comment);

                var denormalizedUser = Mapper.Map<DenormalizedUser>(user);
                comment.User = denormalizedUser;
                comment.PostedOn = DateTime.UtcNow;
                
                //add new comment
                RavenStore.DatabaseCommands.Patch(
                    id,
                    new[]
                    {
                        new PatchRequest
                        {
                            Type = PatchCommandType.Add,
                            Name = "Comments",
                            Value =
                                RavenJObject.FromObject(comment)
                        }
                    });


                RavenSession.SaveChanges();
            
            return comment.Id;
        }

        // PUT api/comments/postId
        [FlexAuthorize(Roles = "admin, user")]
        [AntiForgeryToken]
        public void Put(string id, [FromBody]Comment comment)
        {

            var user = FlexUserStore.GetUserByUsername(User.Identity.Name);
            //update existing comment
            var post = RavenSession.Load<Post>(id);

            if (user.Id != post.User.Id && !FlexRoleProvider.IsUserInRole(user.Username, "admin"))
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "You dont have permission to edit this comment"));


            var dbComment = post.Comments.First(c => c.Id == comment.Id);
            dbComment.Content = comment.Content;
            dbComment.EditedOn = DateTime.UtcNow;

            try
            {
                RavenSession.SaveChanges();
            }
            catch (ConcurrencyException ex)
            {

                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Document was already changed by another user"));
            }
            
            
        }

        // DELETE api/comments/postId/commentId
        [FlexAuthorize(Roles = "admin, user")]
        [AntiForgeryToken]
        public void Delete(string id, string subid)
        {
            //var post = RavenSession.Load<Post>(id);
            //var comment = post.Comments.First(c => c.Id == subid);


                RavenStore.DatabaseCommands.Patch(id,
                    new ScriptedPatchRequest
                    {
                        Script = @"this.Comments.RemoveWhere(function(comment) 
                        { return comment.Id == commentId; });",
                        Values = { { "commentId", subid } }
                    });

            //RavenSession.Delete(comment);
            RavenSession.SaveChanges();

        }

    }
}
