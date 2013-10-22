using System.Web;
using System.Web.Optimization;
using BundleTransformer.Core;
using BundleTransformer.Core.Bundles;
using BundleTransformer.Core.Transformers;

namespace Spa.Web.App_Start
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;

            bundles.Add(new ScriptBundle("~/bundles/libs").Include(
            "~/Scripts/jquery-{version}.js"
            , "~/Scripts/knockout-{version}.js"
            , "~/Scripts/knockout.mapping-latest.js"
            , "~/Scripts/knockout.validation.js"
            , "~/Scripts/sammy-{version}.js"
            , "~/Scripts/bootstrap.js"
            , "~/Scripts/toastr.js"
            , "~/Scripts/wysihtml5/parser_rules/advanced.js"
            , "~/Scripts/wysihtml5/wysihtml5-{version}.js"
            ));

            var commonStylesBundle = new CustomStyleBundle("~/bundles/styles");
            commonStylesBundle.Include(
                "~/Content/bootstrap/bootstrap.less"
                , "~/Content/fontawesome/font-awesome.less"
                , "~/Content/toastr.less"
                , "~/Content/durandal.css"
                , "~/Content/stylesheet.css"
                , "~/Content/slick.less");

            //commonStylesBundle.Transforms.Add(new CssTransformer());

            bundles.Add(commonStylesBundle);


            //// Custom LESS files
            //var lessBundle = new Bundle("~/Content/Less").Include(
            //"~/Content/bootstrap/bootstrap.less"
            //, "~/Content/fontawesome/font-awesome.less"
            //, "~/Content/toastr.less"
            //, "~/Content/durandal.less"
            //, "~/Content/slick.less"
            //);

            

            //lessBundle.Transforms.Add(new LessTransform());
            //lessBundle.Transforms.Add(new CssMinify());
            //bundles.Add(lessBundle);

        }
    }
}