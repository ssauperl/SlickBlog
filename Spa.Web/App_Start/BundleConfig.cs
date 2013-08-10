using System.Web;
using System.Web.Optimization;

namespace Spa.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/libs").Include(
            "~/Scripts/jquery-{version}.js"
            , "~/Scripts/knockout-{version}.js"
            , "~/Scripts/knockout.mapping-latest.js"
            , "~/Scripts/knockout.validation.js"
            , "~/Scripts/sammy-{version}.js"
            , "~/Scripts/amplify.js"
            , "~/Scripts/bootstrap.js"
            , "~/Scripts/tooltip.js"
            , "~/Scripts/toastr.js"
            ));
            

            // Custom LESS files
            var lessBundle = new Bundle("~/Content/Less").Include(
            "~/Content/less/bootstrap.less"
            , "~/Content/fontawesome/font-awesome.less"
            , "~/Content/toastr.less"
            , "~/Content/durandal.less"
            );

            

            lessBundle.Transforms.Add(new LessTransform());
            lessBundle.Transforms.Add(new CssMinify());
            bundles.Add(lessBundle);

        }
    }
}