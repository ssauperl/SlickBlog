using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using SlickBlog.Models;

namespace Spa.Web.App_Start
{
    public class AutoMapperConfig
    {
        public static void Configure()
        {
            Mapper.CreateMap<User, DenormalizedUser>();
            
        }
    }
}