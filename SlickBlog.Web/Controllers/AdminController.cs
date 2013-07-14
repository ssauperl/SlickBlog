using System.Web.Mvc;
using SlickBlog.Web.Filters;

namespace SlickBlog.Web.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        [FlexAuthorize(Roles="admin")]
        public ActionResult Index()
        {
            return Content("You can see me!");
        }

    }
}
