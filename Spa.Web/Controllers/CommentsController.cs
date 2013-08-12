using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SlickBlog.Model;
using Raven.Abstractions.Data;
using Raven.Json.Linq;
using Raven.Client.Document;

namespace Spa.Web.Controllers
{
    public class CommentsController : RavenDbController
    {
        // GET api/comments/postId/commentId
        public Comment Get(string id, string id2)
        {
            return null;
        }

        // PUT api/comments/postId
        public string Put(string id, [FromBody]Comment comment)
        {
            var DocumentSession = (DocumentSession)RavenSession;
            if (comment.Id == null)
            {
                comment.Id = DocumentStore.Conventions.GenerateDocumentKey(DocumentSession.DatabaseName, DocumentSession.DatabaseCommands, comment);

                DocumentStore.DatabaseCommands.Patch(
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
            }
            else
            {
                var post = RavenSession.Load<Post>(id);
                var oldComment = post.Comments.First<Comment>(c => c.Id == comment.Id);
                oldComment.Content = comment.Content;

            }
            return comment.Id;
        }

        // DELETE api/comments/postId/commentId
        public void Delete(string id)
        {

        }

    }
}
