﻿namespace Spa.Web
{
    public static class UserCredentials
    {
        public static bool Validate(string username, string password)
        {
            return (username == password);
        }
    }
}