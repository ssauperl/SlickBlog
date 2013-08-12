using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Spa.Web.Helpers
{
    public static class DocumentPrefixHelpers
    {
        public static string addPrefix(string prefix, string id)
        {
            return prefix + "/" + id;
        }
    }
}